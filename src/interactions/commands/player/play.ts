import { GuildQueue, Player, SearchResult, Track, useMainPlayer, useQueue } from 'discord-player';
import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, SlashCommandBuilder } from 'discord.js';
import { Logger } from 'pino';
import { BaseSlashCommandInteraction, CustomError } from '../../../classes/interactions';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../../types/interactionTypes';
import { checkVoicePermissionJoinAndTalk } from '../../../utils/validation/permissionValidator';
import { transformQuery } from '../../../utils/validation/searchQueryValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../../utils/validation/voiceChannelValidator';

class PlayCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = new SlashCommandBuilder()
            .setName('play')
            .setDescription(
                'Tambahkan lagu (tracks) atau playlist kedalam antrian, dengan judul lagu atau tautan (url)'
            )
            .addStringOption((option) =>
                option
                    .setName('judul')
                    .setDescription('Cari judul lagu (tracks) atau tautan (url)')
                    .setRequired(true)
                    .setMinLength(2)
                    .setMaxLength(500)
                    .setAutocomplete(true)
            );
        super(data);
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, interaction } = params;
        const logger = this.getLogger(this.name, executionId, interaction);

        await this.runValidators({ interaction, executionId }, [checkInVoiceChannel]);

        let queue: GuildQueue = useQueue(interaction.guild!.id)!;

        if (queue) {
            await this.runValidators({ interaction, queue, executionId }, [checkSameVoiceChannel]);
        } else {
            await this.runValidators({ interaction, executionId }, [checkVoicePermissionJoinAndTalk]);
        }

        const player = useMainPlayer()!;
        const searchQuery = interaction.options.getString('judul')!;
        const transformedQuery = await transformQuery({ query: searchQuery, executionId });
        const searchResult = await this.searchTrack(player, transformedQuery, interaction, logger);

        if (!searchResult || searchResult.tracks.length === 0) {
            return await this.handleNoResultsFound(transformedQuery, interaction, logger);
        }

        queue = useQueue(interaction.guild!.id)!;
        const queueSize = queue?.size ?? 0;

        if ((searchResult.playlist! && searchResult.tracks.length) > this.playerOptions.maxQueueSize - queueSize) {
            return await this.handlePlaylistTooLarge(searchQuery, interaction, logger);
        }

        const track: Track | void = await this.addResultsToPlayer(
            player,
            searchResult,
            interaction,
            logger,
            executionId,
            searchQuery
        );

        if (!track) {
            logger.error('Failed to add track to player.');
            throw new Error('Failed to add track to player.');
        }

        return await this.handleResultAddedToQueue(track, searchResult, interaction, logger);
    }

    private async searchTrack(
        player: Player,
        transformedQuery: string,
        interaction: ChatInputCommandInteraction,
        logger: Logger
    ) {
        logger.debug(`Searching for track with query: '${transformedQuery}'.`);
        let searchResult;
        try {
            searchResult = await player.search(transformedQuery, {
                requestedBy: interaction.user
            });
        } catch (error) {
            logger.error(error, `Failed to search for track with player.search() with query: ${transformedQuery}.`);
        }

        return searchResult;
    }

    private async addResultsToPlayer(
        player: Player,
        searchResult: SearchResult,
        interaction: ChatInputCommandInteraction,
        logger: Logger,
        executionId: string,
        query: string
    ) {
        let track;
        try {
            logger.debug(`Attempting to add track with player.play(). Query: '${query}'.`);

            ({ track } = await player.play((interaction.member as GuildMember).voice.channel!, searchResult, {
                requestedBy: interaction.user,
                nodeOptions: {
                    ...this.playerOptions,
                    maxSize: this.playerOptions.maxQueueSize,
                    volume: this.playerOptions.defaultVolume,
                    metadata: {
                        channel: interaction.channel,
                        client: interaction.client,
                        requestedBy: interaction.user
                    }
                }
            }));
        } catch (error) {
            if (error instanceof CustomError) {
                if (error.message.includes('Sign in to confirm your age')) {
                    return this.handleAgeConfirmationError(interaction, logger, executionId);
                }
                if (error.message.includes('The following content may contain')) {
                    return this.handleSensitiveTopicError(interaction, logger, executionId);
                }
                if (
                    error.message === "Cannot read properties of null (reading 'createStream')" ||
                    error.message.includes('Failed to fetch resources for ytdl streaming') ||
                    error.message.includes('Could not extract stream for this track')
                ) {
                    return this.handleStreamError(interaction, logger, executionId, error, query);
                }
                if (error.message === 'Cancelled') {
                    return this.handleCancelledError(interaction, logger, executionId, query);
                }

                logger.error(error, 'Failed to play track with player.play(), unhandled error.');
            } else {
                throw error;
            }
        }

        return track;
    }

    private async handleResultAddedToQueue(
        track: Track,
        searchResult: SearchResult,
        interaction: ChatInputCommandInteraction,
        logger: Logger
    ) {
        logger.debug('Result found and added with player.play(), added to queue.');
        const queue: GuildQueue = useQueue(interaction.guild!.id)!;
        const trackUrl = this.getFormattedTrackUrl(track);

        let message = `**${this.embedOptions.icons.nyctophileZuiHeadphones} | Menambahkan** ${trackUrl} ke dalam antrian.`;

        if (searchResult.playlist) {
            message = `**${this.embedOptions.icons.nyctophileZuiHeadphones} | Menambahkan** playlist kedalam antrian. ${trackUrl} dan **${searchResult.tracks.length}** lagu (tracks) lainnya. Gunakan perintah (command) **\`/queue\`** untuk melihat semua antrian.`;
        } else if (queue.currentTrack === track && queue.tracks.data.length === 0) {
            message = `**${this.embedOptions.icons.nyctophileZuiPlay} | Memainkan** ${trackUrl}.`;
        }

        logger.debug('Responding with success embed.');
        return await interaction.editReply({
            embeds: [new EmbedBuilder().setDescription(message).setColor(this.embedOptions.colors.success)]
        });
    }

    private async handleNoResultsFound(
        transformedQuery: string,
        interaction: ChatInputCommandInteraction,
        logger: Logger
    ) {
        logger.debug(`No results found for query: '${transformedQuery}'`);
        logger.debug('Responding with warning embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${this.embedOptions.icons.nyctophileZuiMegaphone} | Maaf** sepertinya aku ngga bisa nemuin lagu (tracks) **\`${transformedQuery}\`**. Kalau kamu menggunakan tautan (url), pastikan tautan tersebut valid dan publik.`
                    )
                    .setColor(this.embedOptions.colors.warning)
            ]
        });
    }

    private async handlePlaylistTooLarge(query: string, interaction: ChatInputCommandInteraction, logger: Logger) {
        logger.debug(`Playlist found but would exceed max queue size. Query: '${query}'.`);

        logger.debug('Responding with warning embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${this.embedOptions.icons.nyctophileZuiDart} | Oops!** Aku cuma bisa menampung sebanyak **${this.playerOptions.maxQueueSize}** lagu (tracks). Dan sepertinya lagu (tracks) yang ada di dalam playlist kamu terlalu banyak! Tenang, aku akan menambahkan-nya kedalam antrian.\n\n`
                    )
                    .setColor(this.embedOptions.colors.warning)
            ]
        });
    }

    private async handleAgeConfirmationError(
        interaction: ChatInputCommandInteraction,
        logger: Logger,
        executionId: string
    ) {
        logger.debug('Found track but failed to retrieve audio due to age confirmation warning.');

        logger.debug('Responding with warning embed.');
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${this.embedOptions.icons.nyctophileZuiWarning} | Uh-oh...** Sepertinya lagu (tracks) ini memiliki batasan usia dan membutuhkan login untuk mengaksesnya. Oleh karena itu aku ngga dapat memainkan lagu (tracks) ini.`
                    )
                    .setColor(this.embedOptions.colors.warning)
                    .setFooter({ text: `Execution ID: ${executionId}` })
            ]
        });
        return Promise.resolve();
    }

    private async handleSensitiveTopicError(
        interaction: ChatInputCommandInteraction,
        logger: Logger,
        executionId: string
    ) {
        logger.debug('Found track but failed to retrieve audio due to graphic/mature/sensitive topic warning.');

        logger.debug('Responding with warning embed.');
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${this.embedOptions.icons.nyctophileZuiWarning} | Uh-oh...** Sepertinya lagu (tracks) ini tidak dapat diputar karena sumber video-nya memiliki peringatan sensitif. Itu membutuhkan konfirmasi manual untuk memutar video, oleh karena itu aku ngga bisa memainkan lagu (tracks) ini.`
                    )
                    .setColor(this.embedOptions.colors.warning)
                    .setFooter({ text: `Execution ID: ${executionId}` })
            ]
        });
        return Promise.resolve();
    }

    private async handleStreamError(
        interaction: ChatInputCommandInteraction,
        logger: Logger,
        executionId: string,
        error: Error,
        query: string
    ) {
        logger.debug(error, `Found track but failed to retrieve audio. Query: ${query}.`);

        logger.debug('Responding with error embed.');
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${this.embedOptions.icons.nyctophileZuiWarning} | Uh-oh...** Setelah menemukan hasil, aku gagal mengambil audio untuk lagu (tracks)!`
                    )
                    .setColor(this.embedOptions.colors.error)
                    .setFooter({ text: `Execution ID: ${executionId}` })
            ]
        });
        return Promise.resolve();
    }

    private async handleCancelledError(
        interaction: ChatInputCommandInteraction,
        logger: Logger,
        executionId: string,
        query: string
    ) {
        logger.debug(`Operation cancelled. Query: ${query}.`);

        logger.debug('Responding with error embed.');
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${this.embedOptions.icons.nyctophileZuiWarning} | Uh-oh...** Sesuatu yang tidak terduga terjadi, aku gagal menambahkan lagu (tracks)!`
                    )
                    .setColor(this.embedOptions.colors.error)
                    .setFooter({ text: `Execution ID: ${executionId}` })
            ]
        });
        return Promise.resolve();
    }
}

export default new PlayCommand();
