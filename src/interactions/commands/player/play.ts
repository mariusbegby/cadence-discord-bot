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
            .setDescription('Add a track or playlist to the queue by search query or URL.')
            .addStringOption((option) =>
                option
                    .setName('query')
                    .setDescription('Search query by text or URL')
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
        const searchQuery = interaction.options.getString('query')!;
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
        const trackUrl = this.getDisplayTrackDurationAndUrl(track);

        let message = `${this.embedOptions.icons.success} **Added to queue**\n${trackUrl}`;
        if (searchResult.playlist) {
            const otherTracksString = `And **${searchResult.tracks.length}** more tracks... **\`/queue\`** to view all.`;
            message = `${this.embedOptions.icons.success} **Added playlist to queue**\n${trackUrl}\n\n${otherTracksString}`;
        } else if (queue.currentTrack === track && queue.tracks.data.length === 0) {
            message = `**${this.embedOptions.icons.audioStartedPlaying} Now playing**\n${trackUrl}`;
        }

        logger.debug('Responding with success embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(await this.getEmbedUserAuthor(interaction))
                    .setDescription(message)
                    .setThumbnail(this.getTrackThumbnailUrl(track))
                    .setColor(this.embedOptions.colors.success)
            ]
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
                        `**${this.embedOptions.icons.warning} No track found**\n` +
                            `No results found for **\`${transformedQuery}\`**.\n\n` +
                            'If you specified a URL, please make sure it is valid and public.'
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
                        `**${this.embedOptions.icons.warning} Playlist too large**\n` +
                            'This playlist is too large to be added to the queue.\n\n' +
                            `The maximum amount of tracks that can be added to the queue is **${this.playerOptions.maxQueueSize}**.`
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
                        `**${this.embedOptions.icons.warning} Cannot retrieve audio for track**\n` +
                            'This audio source is age restricted and requires login to access. Because of this I cannot retrieve the audio for the track.\n\n' +
                            `_If you think this message is incorrect, please submit a bug report in the **[support server](${this.botOptions.serverInviteUrl})**._`
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
                        `**${this.embedOptions.icons.warning} Cannot retrieve audio for track**\n` +
                            'This audio source cannot be played as the video source has a warning for graphic or sensistive topics. It requires a manual confirmation to to play the video, and because of this I am unable to extract the audio for this source.\n\n' +
                            `_If you think this message is incorrect, please submit a bug report in the **[support server](${this.botOptions.serverInviteUrl})**._`
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
                        `**${this.embedOptions.icons.error} Uh-oh... Failed to add track!**\n` +
                            'After finding a result, I was unable to retrieve audio for the track.\n\n' +
                            'You can try to perform the command again.\n\n' +
                            `_If you think this message is incorrect, please submit a bug report in the **[support server](${this.botOptions.serverInviteUrl})**._`
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
                        `**${this.embedOptions.icons.error} Uh-oh... Failed to add track!**` +
                            '\nSomething unexpected happened and the operation was cancelled.\n\n' +
                            'You can try to perform the command again.\n\n' +
                            `_If you think this message is incorrect, please submit a bug report in the **[support server](${this.botOptions.serverInviteUrl})**._`
                    )
                    .setColor(this.embedOptions.colors.error)
                    .setFooter({ text: `Execution ID: ${executionId}` })
            ]
        });
        return Promise.resolve();
    }
}

export default new PlayCommand();
