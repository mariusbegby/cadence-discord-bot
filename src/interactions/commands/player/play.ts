import config from 'config';
import { GuildQueue, useMainPlayer, useQueue } from 'discord-player';
import { EmbedBuilder, GuildMember, SlashCommandBuilder } from 'discord.js';
import { BaseSlashCommandInteraction, CustomError } from '../../../classes/interactions';
import { PlayerOptions } from '../../../types/configTypes';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../../types/interactionTypes';
import { checkVoicePermissionJoinAndTalk } from '../../../utils/validation/permissionValidator';
import { transformQuery } from '../../../utils/validation/searchQueryValidator';
import { checkSameVoiceChannel, checkInVoiceChannel } from '../../../utils/validation/voiceChannelValidator';

const playerOptions: PlayerOptions = config.get('playerOptions');

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

        this.validators = [(args) => checkInVoiceChannel(args)];
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, interaction } = params;
        const logger = this.getLogger(this.name, executionId, interaction);

        await this.runValidators({ interaction, executionId });

        let queue: GuildQueue = useQueue(interaction.guild!.id)!;
        if (queue) {
            await this.runValidators({ interaction, queue, executionId }, [checkSameVoiceChannel]);
        } else {
            await this.runValidators({ interaction, executionId }, [checkVoicePermissionJoinAndTalk]);
        }

        const player = useMainPlayer()!;
        const query = interaction.options.getString('query')!;

        const transformedQuery = await transformQuery({ query, executionId });

        let searchResult;

        try {
            searchResult = await player.search(transformedQuery, {
                requestedBy: interaction.user
            });
        } catch (error) {
            logger.error(error, `Failed to search for track with player.search() with query: ${transformedQuery}.`);
        }

        if (!searchResult || searchResult.tracks.length === 0) {
            logger.debug(`No results found for query: '${query}'`);

            logger.debug('Responding with warning embed.');
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${this.embedOptions.icons.warning} No track found**\nNo results found for **\`${transformedQuery}\`**.\n\nIf you specified a URL, please make sure it is valid and public.`
                        )
                        .setColor(this.embedOptions.colors.warning)
                ]
            });
        }

        queue = useQueue(interaction.guild!.id)!;
        const queueSize = queue?.size ?? 0;

        if ((searchResult.playlist! && searchResult.tracks.length) > playerOptions.maxQueueSize - queueSize) {
            logger.debug(`Playlist found but would exceed max queue size. Query: '${query}'.`);

            logger.debug('Responding with warning embed.');
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${this.embedOptions.icons.warning} Playlist too large**\nThis playlist is too large to be added to the queue.\n\nThe maximum amount of tracks that can be added to the queue is **${playerOptions.maxQueueSize}**.`
                        )
                        .setColor(this.embedOptions.colors.warning)
                ]
            });
        }

        let track;

        try {
            logger.debug(`Attempting to add track with player.play(). Query: '${query}'.`);

            ({ track } = await player.play((interaction.member as GuildMember).voice.channel!, searchResult, {
                requestedBy: interaction.user,
                nodeOptions: {
                    leaveOnEmpty: playerOptions.leaveOnEmpty ?? true,
                    leaveOnEmptyCooldown: playerOptions.leaveOnEmptyCooldown ?? 300_000,
                    leaveOnEnd: playerOptions.leaveOnEnd ?? true,
                    leaveOnEndCooldown: playerOptions.leaveOnEndCooldown ?? 300_000,
                    leaveOnStop: playerOptions.leaveOnStop ?? true,
                    leaveOnStopCooldown: playerOptions.leaveOnStopCooldown ?? 300_000,
                    maxSize: playerOptions.maxQueueSize ?? 1000,
                    maxHistorySize: playerOptions.maxHistorySize ?? 100,
                    volume: playerOptions.defaultVolume ?? 50,
                    bufferingTimeout: playerOptions.bufferingTimeout ?? 3000,
                    connectionTimeout: playerOptions.connectionTimeout ?? 30000,
                    metadata: {
                        channel: interaction.channel,
                        client: interaction.client,
                        requestedBy: interaction.user,
                        track: searchResult.tracks[0]
                    }
                }
            }));
        } catch (error) {
            if (error instanceof CustomError) {
                if (error.message.includes('Sign in to confirm your age')) {
                    logger.debug('Found track but failed to retrieve audio due to age confirmation warning.');

                    logger.debug('Responding with warning embed.');
                    return await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(
                                    `**${this.embedOptions.icons.warning} Cannot retrieve audio for track**\nThis audio source is age restricted and requires login to access. Because of this I cannot retrieve the audio for the track.\n\n_If you think this message is incorrect, please submit a bug report in the **[support server](${this.botOptions.serverInviteUrl})**._`
                                )
                                .setColor(this.embedOptions.colors.warning)
                        ]
                    });
                }

                if (error.message.includes('The following content may contain')) {
                    logger.debug(
                        'Found track but failed to retrieve audio due to graphic/mature/sensitive topic warning.'
                    );

                    logger.debug('Responding with warning embed.');
                    return await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(
                                    `**${this.embedOptions.icons.warning} Cannot retrieve audio for track**\nThis audio source cannot be played as the video source has a warning for graphic or sensistive topics. It requires a manual confirmation to to play the video, and because of this I am unable to extract the audio for this source.\n\n_If you think this message is incorrect, please submit a bug report in the **[support server](${this.botOptions.serverInviteUrl})**._`
                                )
                                .setColor(this.embedOptions.colors.warning)
                        ]
                    });
                }

                if (
                    error.message === "Cannot read properties of null (reading 'createStream')" ||
                    error.message.includes('Failed to fetch resources for ytdl streaming') ||
                    error.message.includes('Could not extract stream for this track')
                ) {
                    logger.debug(error, `Found track but failed to retrieve audio. Query: ${query}.`);

                    // note: reading 'createStream' error can happen if queue is destroyed before track starts playing, e.g. /leave quickly after /play

                    logger.debug('Responding with error embed.');
                    return await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(
                                    `**${this.embedOptions.icons.error} Uh-oh... Failed to add track!**\nAfter finding a result, I was unable to retrieve audio for the track.\n\nYou can try to perform the command again.\n\n_If you think this message is incorrect, please submit a bug report in the **[support server](${this.botOptions.serverInviteUrl})**._`
                                )
                                .setColor(this.embedOptions.colors.error)
                                .setFooter({ text: `Execution ID: ${executionId}` })
                        ]
                    });
                }

                if (error.message === 'Cancelled') {
                    logger.debug(error, `Operation cancelled. Query: ${query}.`);

                    logger.debug('Responding with error embed.');
                    return await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(
                                    `**${this.embedOptions.icons.error} Uh-oh... Failed to add track!**\nSomething unexpected happened and the operation was cancelled.\n\nYou can try to perform the command again.\n\n_If you think this message is incorrect, please submit a bug report in the **[support server](${this.botOptions.serverInviteUrl})**._`
                                )
                                .setColor(this.embedOptions.colors.error)
                                .setFooter({ text: `Execution ID: ${executionId}` })
                        ]
                    });
                }

                logger.error(error, 'Failed to play track with player.play(), unhandled error.');
            } else {
                throw error;
            }
        }

        logger.debug(`Successfully added track with player.play(). Query: '${query}'.`);

        queue = useQueue(interaction.guild!.id)!;

        if (!queue || !track) {
            logger.warn(`After player.play(), queue is undefined. Query: '${query}'.`);

            logger.debug('Responding with error embed.');
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${this.embedOptions.icons.error} Uh-oh... Failed to add track!**\nThere was an issue adding this track to the queue.\n\nYou can try to perform the command again.\n\n_If this problem persists, please submit a bug report in the **[support server](${this.botOptions.serverInviteUrl})**._`
                        )
                        .setColor(this.embedOptions.colors.error)
                        .setFooter({ text: `Execution ID: ${executionId}` })
                ]
            });
        }

        if (
            track.source.length === 0 ||
            track.source === 'arbitrary' ||
            track.thumbnail === null ||
            track.thumbnail === undefined ||
            track.thumbnail === ''
        ) {
            logger.debug(
                `Track found but source is arbitrary or missing thumbnail. Using fallback thumbnail url. Query: '${query}'.`
            );
            track.thumbnail = this.embedOptions.info.fallbackThumbnailUrl;
        }

        let durationFormat =
            Number(track.raw.duration) === 0 || track.duration === '0:00' ? '' : `\`${track.duration}\``;

        if (track.raw.live) {
            durationFormat = `${this.embedOptions.icons.liveTrack} \`LIVE\``;
        }

        if (searchResult.playlist && searchResult.tracks.length > 1) {
            logger.debug(`Playlist found and added with player.play(). Query: '${query}'`);

            logger.debug('Responding with success embed.');
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor(await this.getEmbedUserAuthor(interaction))
                        .setDescription(
                            `**${this.embedOptions.icons.success} Added playlist to queue**\n**${durationFormat} [${
                                track.title
                            }](${track.raw.url ?? track.url})**\n\nAnd **${
                                searchResult.tracks.length - 1
                            }** more tracks... **\`/queue\`** to view all.`
                        )
                        .setThumbnail(track.thumbnail)
                        .setColor(this.embedOptions.colors.success)
                ]
            });
        }

        if (queue && queue.currentTrack === track && queue.tracks.data.length === 0) {
            logger.debug(`Track found and added with player.play(), started playing. Query: '${query}'.`);

            logger.debug('Responding with success embed.');
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor(await this.getEmbedUserAuthor(interaction))
                        .setDescription(
                            `**${this.embedOptions.icons.audioStartedPlaying} Started playing**\n**${durationFormat} [${
                                track.title
                            }](${track.raw.url ?? track.url})**`
                        )
                        .setThumbnail(track.thumbnail)
                        .setColor(this.embedOptions.colors.success)
                ]
            });
        }

        logger.debug(`Track found and added with player.play(), added to queue. Query: '${query}'.`);

        logger.debug('Responding with success embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(await this.getEmbedUserAuthor(interaction))
                    .setDescription(
                        `${this.embedOptions.icons.success} **Added to queue**\n**${durationFormat} [${track.title}](${
                            track.raw.url ?? track.url
                        })**`
                    )
                    .setThumbnail(track.thumbnail)
                    .setColor(this.embedOptions.colors.success)
            ]
        });
    }
}

export default new PlayCommand();
