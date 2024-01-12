import { GuildQueue, Player, SearchResult, Track, useMainPlayer } from 'discord-player';
import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    EmbedFooterData,
    GuildMember,
    Message,
    SlashCommandBuilder
} from 'discord.js';
import { Logger } from 'pino';
import { BaseSlashCommandInteraction, CustomError } from '../../../classes/interactions';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../../types/interactionTypes';
import { checkVoicePermissionJoinAndTalk } from '../../../utils/validation/permissionValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../../utils/validation/voiceChannelValidator';
import { transformQuery } from '../../../utils/validation/searchQueryValidator';
import { localizeCommand, useServerTranslator } from '../../../common/localeUtil';
import { TFunction } from 'i18next';
import { formatSlashCommand } from '../../../common/formattingUtils';

class PlayCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = localizeCommand(
            new SlashCommandBuilder()
                .setName('play')
                .addStringOption((option) =>
                    option.setName('query').setRequired(true).setMinLength(2).setMaxLength(500).setAutocomplete(true)
                )
        );
        super(data);
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, interaction } = params;
        const logger = this.getLogger(this.name, executionId, interaction);
        const translator = useServerTranslator(interaction);

        await this.runValidators({ interaction, executionId }, [checkInVoiceChannel]);

        const player = useMainPlayer()!;
        const queue: GuildQueue =
            player.nodes.resolve(interaction.guild!.id) ||
            player.nodes.create(interaction.guild!.id, {
                ...this.playerOptions,
                maxSize: this.playerOptions.maxQueueSize,
                volume: this.playerOptions.defaultVolume,
                metadata: {
                    channel: interaction.channel,
                    client: interaction.client,
                    requestedBy: interaction.user
                }
            });
        if (queue) {
            await this.runValidators({ interaction, queue, executionId }, [checkSameVoiceChannel]);
        } else {
            await this.runValidators({ interaction, executionId }, [checkVoicePermissionJoinAndTalk]);
        }

        const searchQuery = interaction.options.getString('query')!;
        const transformedQuery = transformQuery({ query: searchQuery, executionId });

        const searchResult = await this.searchTrack(player, transformedQuery, interaction, logger);
        if (!searchResult || searchResult.tracks.length === 0) {
            return await this.handleNoResultsFound(transformedQuery, interaction, logger, translator);
        }

        const queueSize = queue?.size ?? 0;

        if ((searchResult.playlist! && searchResult.tracks.length) > this.playerOptions.maxQueueSize - queueSize) {
            return await this.handlePlaylistTooLarge(searchQuery, interaction, logger, translator);
        }

        const track: Track | void = await this.addResultsToPlayer(
            searchResult,
            interaction,
            queue,
            logger,
            executionId,
            searchQuery
        );

        if (!track) {
            logger.error('Failed to add track to player.');
            throw new Error('Failed to add track to player.');
        }

        return await this.handleResultAddedToQueue(track, searchResult, interaction, queue, logger, translator);
    }

    private async searchTrack(
        player: Player,
        transformedQuery: string,
        interaction: ChatInputCommandInteraction,
        logger: Logger
    ): Promise<SearchResult | undefined> {
        logger.debug(`Searching for track with query: '${transformedQuery}'.`);
        try {
            return await player.search(transformedQuery, {
                requestedBy: interaction.user
            });
        } catch (error) {
            logger.error(error, `Failed to search for track with player.search() with query: ${transformedQuery}.`);
            return undefined;
        }
    }

    private async addResultsToPlayer(
        searchResult: SearchResult,
        interaction: ChatInputCommandInteraction,
        queue: GuildQueue,
        logger: Logger,
        executionId: string,
        query: string
    ): Promise<Track | void> {
        try {
            logger.debug(`Attempting to add track with player.play(). Query: '${query}'.`);

            const voiceChannel = (interaction.member as GuildMember).voice.channel!;
            if (!queue.channel) {
                await queue.connect(voiceChannel);
            }

            const track = searchResult.tracks[0];
            const playlist = searchResult.playlist;

            try {
                if (searchResult.hasPlaylist()) {
                    playlist?.tracks.forEach((track) => {
                        queue.addTrack(track);
                    });
                } else {
                    queue.addTrack(track);
                }

                if (!queue.isPlaying()) {
                    await queue.node.play();
                }
            } catch (error) {
                logger.error(error, 'Failed to add track to player.');
            }

            logger.debug('Successfully added track to player.');

            return track;
        } catch (error) {
            if (error instanceof CustomError) {
                if (error.message.includes('Sign in to confirm your age')) {
                    this.handleAgeConfirmationError(interaction, logger, executionId);
                }

                if (error.message.includes('The following content may contain')) {
                    this.handleSensitiveTopicError(interaction, logger, executionId);
                }

                if (
                    error.message === "Cannot read properties of null (reading 'createStream')" ||
                    error.message.includes('Failed to fetch resources for ytdl streaming') ||
                    error.message.includes('Could not extract stream for this track')
                ) {
                    this.handleStreamError(interaction, logger, executionId, error, query);
                }

                if (error.message === 'Cancelled') {
                    this.handleCancelledError(interaction, logger, executionId, query);
                }

                logger.error(error, 'Failed to play track with player.play(), unhandled error.');
            } else {
                throw error;
            }

            return Promise.resolve();
        }
    }

    private async handleResultAddedToQueue(
        track: Track,
        searchResult: SearchResult,
        interaction: ChatInputCommandInteraction,
        queue: GuildQueue,
        logger: Logger,
        translator: TFunction
    ): Promise<Message> {
        logger.debug('Result found and added with player.play(), added to queue.');
        const trackUrl = this.getDisplayTrackDurationAndUrl(track, translator);

        let embedFooter: EmbedFooterData | undefined = this.getDisplayFooterTrackPosition(
            queue.tracks.data.length ?? 0,
            translator
        );
        let message =
            translator('commands.play.addedToQueueTitle', {
                icon: this.embedOptions.icons.success
            }) +
            '\n' +
            trackUrl;
        if (searchResult.playlist) {
            message =
                translator('commands.play.playlistAddedTitle', {
                    icon: this.embedOptions.icons.success
                }) +
                '\n' +
                trackUrl +
                '\n' +
                '\n' +
                translator('commands.play.playlistAddedTrackCount', {
                    count: searchResult.tracks.length,
                    queueCommand: formatSlashCommand('queue', translator)
                });
            if (queue.tracks.data.length != searchResult.tracks.length) {
                const posistionFirstTrackInPlaylist = queue.tracks.data.length - searchResult.tracks.length + 1;
                embedFooter = this.getDisplayFooterTrackPosition(posistionFirstTrackInPlaylist, translator);
            }
        }

        const embed = new EmbedBuilder()
            .setAuthor(this.getEmbedUserAuthor(interaction))
            .setDescription(message)
            .setThumbnail(this.getTrackThumbnailUrl(track))
            .setColor(this.embedOptions.colors.success);

        if (embedFooter) {
            embed.setFooter(embedFooter);
        }

        logger.debug('Responding with success embed.');

        return await interaction.editReply({
            embeds: [embed]
        });
    }

    private getDisplayFooterTrackPosition(position: number, translator: TFunction): EmbedFooterData {
        const fullFooterData = {
            text: translator('commands.play.footerAddedPosition', {
                position: position
            })
        };

        return fullFooterData;
    }

    private async handleNoResultsFound(
        transformedQuery: string,
        interaction: ChatInputCommandInteraction,
        logger: Logger,
        translator: TFunction
    ): Promise<Message> {
        logger.debug(`No results found for query: '${transformedQuery}'`);

        logger.debug('Responding with warning embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        translator('commands.play.trackNotFound', {
                            icon: this.embedOptions.icons.warning,
                            query: transformedQuery
                        })
                    )
                    .setColor(this.embedOptions.colors.warning)
            ]
        });
    }

    private async handlePlaylistTooLarge(
        query: string,
        interaction: ChatInputCommandInteraction,
        logger: Logger,
        translator: TFunction
    ): Promise<Message> {
        logger.debug(`Playlist found but would exceed max queue size. Query: '${query}'.`);

        logger.debug('Responding with warning embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        translator('commands.play.playlistTooLarge', {
                            icon: this.embedOptions.icons.warning,
                            count: this.playerOptions.maxQueueSize
                        })
                    )
                    .setColor(this.embedOptions.colors.warning)
            ]
        });
    }

    private async handleAgeConfirmationError(
        interaction: ChatInputCommandInteraction,
        logger: Logger,
        executionId: string
    ): Promise<Message> {
        logger.debug('Found track but failed to retrieve audio due to age confirmation warning.');

        logger.debug('Responding with warning embed.');
        return await interaction.editReply({
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
    }

    private async handleSensitiveTopicError(
        interaction: ChatInputCommandInteraction,
        logger: Logger,
        executionId: string
    ): Promise<Message> {
        logger.debug('Found track but failed to retrieve audio due to graphic/mature/sensitive topic warning.');

        logger.debug('Responding with warning embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${this.embedOptions.icons.warning} Cannot retrieve audio for track**\n` +
                            'This audio source cannot be played as the video source has a warning for graphic or sensitive topics. It requires a manual confirmation to play the video, and because of this I am unable to extract the audio for this source.\n\n' +
                            `_If you think this message is incorrect, please submit a bug report in the **[support server](${this.botOptions.serverInviteUrl})**._`
                    )
                    .setColor(this.embedOptions.colors.warning)
                    .setFooter({ text: `Execution ID: ${executionId}` })
            ]
        });
    }

    private async handleStreamError(
        interaction: ChatInputCommandInteraction,
        logger: Logger,
        executionId: string,
        error: Error,
        query: string
    ): Promise<Message> {
        logger.debug(error, `Found track but failed to retrieve audio. Query: ${query}.`);

        logger.debug('Responding with error embed.');
        return await interaction.editReply({
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
    }

    private async handleCancelledError(
        interaction: ChatInputCommandInteraction,
        logger: Logger,
        executionId: string,
        query: string
    ): Promise<Message> {
        logger.debug(`Operation cancelled. Query: ${query}.`);

        logger.debug('Responding with error embed.');
        return await interaction.editReply({
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
    }
}

export default new PlayCommand();