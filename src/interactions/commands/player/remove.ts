import { GuildQueue, Track, useQueue } from 'discord-player';
import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { BaseSlashCommandInteraction } from '../../../classes/interactions';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../../types/interactionTypes';
import { checkQueueExists } from '../../../utils/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../../utils/validation/voiceChannelValidator';
import { Logger } from 'pino';

class RemoveCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = new SlashCommandBuilder()
            .setName('remove')
            .setDescription('Remove tracks from the queue')
            .addSubcommand((subcommand) =>
                subcommand
                    .setName('track')
                    .setDescription('Remove a track from the queue by position')
                    .addIntegerOption((option) =>
                        option
                            .setName('position')
                            .setDescription('The position in queue for track to remove.')
                            .setMinValue(1)
                            .setRequired(true)
                    )
            )
            .addSubcommand((subcommand) =>
                subcommand
                    .setName('range')
                    .setDescription('Remove a range of tracks from the queue')
                    .addIntegerOption((option) =>
                        option
                            .setName('start')
                            .setDescription('The starting position of the range to remove')
                            .setRequired(true)
                    )
                    .addIntegerOption((option) =>
                        option
                            .setName('end')
                            .setDescription('The ending position of the range to remove')
                            .setRequired(true)
                    )
            )
            .addSubcommand((subcommand) =>
                subcommand.setName('queue').setDescription('Remove all tracks from the queue')
            )
            .addSubcommand((subcommand) =>
                subcommand
                    .setName('user')
                    .setDescription('Remove all tracks from a specific user')
                    .addUserOption((option) =>
                        option.setName('target').setDescription('User to remove tracks for').setRequired(true)
                    )
            )
            .addSubcommand((subcommand) =>
                subcommand.setName('duplicates').setDescription('Remove all duplicate tracks from the queue')
            );
        super(data);
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, interaction } = params;
        const logger = this.getLogger(this.name, executionId, interaction);

        const queue: GuildQueue = useQueue(interaction.guild!.id)!;

        await this.runValidators({ interaction, queue, executionId }, [
            checkInVoiceChannel,
            checkSameVoiceChannel,
            checkQueueExists
        ]);

        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case 'track':
                return await this.handleRemovedTrack(logger, interaction, queue);
            case 'range':
                return await this.handleRemoveRange(logger, interaction, queue);
            case 'queue':
                return await this.handleRemoveQueue(logger, interaction, queue);
            case 'user':
                return await this.handleRemoveUserTracks(logger, interaction, queue);
            case 'duplicates':
                return await this.handleRemoveDuplicates(logger, interaction, queue);
            default:
                return Promise.resolve();
        }
    }

    private async handleRemoveUserTracks(logger: Logger, interaction: ChatInputCommandInteraction, queue: GuildQueue) {
        const targetUser = interaction.options.getUser('target')!;
        const removedTracks: Track[] = [];
        queue.tracks.data.forEach((track) => {
            if (track.requestedBy?.id === targetUser.id) {
                const removedTrack = queue.node.remove(track);
                if (removedTrack) {
                    removedTracks.push(removedTrack);
                }
            }
        });

        if (removedTracks.length === 0) {
            return await this.handleNoTracksRemoved(logger, interaction);
        }

        logger.debug(`Removed ${removedTracks.length} tracks from queue added by a user.`);

        return await this.handleResponseRemovedTracks(logger, interaction, removedTracks.length);
    }

    private async handleRemoveDuplicates(logger: Logger, interaction: ChatInputCommandInteraction, queue: GuildQueue) {
        const removedTracks: Track[] = [];
        const uniqueTrackUrls = new Set<string>();
        queue.tracks.data.forEach((track) => {
            if (uniqueTrackUrls.has(track.url)) {
                const removedTrack = queue.node.remove(track);
                if (removedTrack) {
                    removedTracks.push(removedTrack);
                }
            } else {
                uniqueTrackUrls.add(track.url);
            }
        });

        if (removedTracks.length === 0) {
            return await this.handleNoTracksRemoved(logger, interaction);
        }

        logger.debug(`Removed ${removedTracks.length} duplicate tracks from queue.`);

        return await this.handleResponseRemovedTracks(logger, interaction, removedTracks.length);
    }

    private async handleRemoveRange(logger: Logger, interaction: ChatInputCommandInteraction, queue: GuildQueue) {
        const start: number = interaction.options.getInteger('start')!;
        const end: number = interaction.options.getInteger('end')!;

        if (start > queue.tracks.data.length || end > queue.tracks.data.length) {
            return await this.handleTrackPositionHigherThanQueueLength(logger, interaction, start, queue);
        } else if (start > end) {
            logger.debug('Start position is higher than end position.');

            logger.debug('Responding with warning embed.');
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${this.embedOptions.icons.warning} Oops!**\n` +
                                `Start position **\`${start}\`** is higher than end position **\`${end}\`**. Please specify a valid range.` +
                                '\n\nView tracks added to the queue with **`/queue`**.'
                        )
                        .setColor(this.embedOptions.colors.warning)
                ]
            });
            return Promise.resolve();
        }

        const removedTracks: Track[] = [];
        for (let i = start; i <= end; i++) {
            const track = queue.node.remove(start - 1);
            if (track) {
                removedTracks.push(track);
            }
        }

        if (removedTracks.length === 0) {
            return await this.handleNoTracksRemoved(logger, interaction);
        }

        logger.debug(`Removed ${removedTracks.length} tracks from queue.`);

        return await this.handleResponseRemovedTracks(logger, interaction, removedTracks.length);
    }

    private async handleRemoveQueue(logger: Logger, interaction: ChatInputCommandInteraction, queue: GuildQueue) {
        const queueLength = queue.tracks.data.length;
        queue.clear();

        if (queueLength === 0) {
            return await this.handleNoTracksRemoved(logger, interaction);
        }

        logger.debug('Cleared the queue and removed all tracks.');

        return await this.handleResponseRemovedTracks(logger, interaction, queueLength);
    }

    private async handleRemovedTrack(logger: Logger, interaction: ChatInputCommandInteraction, queue: GuildQueue) {
        const trackPositionInput: number = interaction.options.getInteger('position')!;

        if (trackPositionInput > queue.tracks.data.length) {
            return await this.handleTrackPositionHigherThanQueueLength(logger, interaction, trackPositionInput, queue);
        }

        const removedTrack: Track = queue.node.remove(trackPositionInput - 1)!;
        logger.debug(`Removed track '${removedTrack.url}' from queue.`);

        logger.debug('Responding with success embed.');
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(this.getEmbedUserAuthor(interaction))
                    .setDescription(
                        `**${this.embedOptions.icons.success} Removed track**\n${this.getDisplayTrackDurationAndUrl(
                            removedTrack
                        )}`
                    )
                    .setThumbnail(this.getTrackThumbnailUrl(removedTrack))
                    .setColor(this.embedOptions.colors.success)
            ]
        });
        return Promise.resolve();
    }

    private async handleNoTracksRemoved(logger: Logger, interaction: ChatInputCommandInteraction) {
        logger.debug('Responding with warning embed.');
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(this.getEmbedUserAuthor(interaction))
                    .setDescription(
                        `**${this.embedOptions.icons.warning} No tracks removed**\n` +
                            'There were no tracks removed from the queue. Please check if the option you selected has tracks to remove.'
                    )
                    .setColor(this.embedOptions.colors.warning)
            ]
        });
        return Promise.resolve();
    }

    private async handleResponseRemovedTracks(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        removedAmount: number
    ) {
        logger.debug('Responding with success embed.');
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(this.getEmbedUserAuthor(interaction))
                    .setDescription(
                        `**${this.embedOptions.icons.success} Removed tracks**\n` +
                            `**\`${removedAmount}\`** tracks were removed from the queue.`
                    )
                    .setColor(this.embedOptions.colors.success)
            ]
        });
        return Promise.resolve();
    }

    private async handleTrackPositionHigherThanQueueLength(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        trackPositionInput: number,
        queue: GuildQueue
    ) {
        logger.debug('Specified track position is higher than total tracks.');

        logger.debug('Responding with warning embed.');
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${this.embedOptions.icons.warning} Oops!**\n` +
                            `Position **\`${trackPositionInput}\`** is not a valid track position. There are only a total of **\`${queue.tracks.data.length}\`** tracks in the queue.` +
                            '\n\nView tracks added to the queue with **`/queue`**.'
                    )
                    .setColor(this.embedOptions.colors.warning)
            ]
        });
        return Promise.resolve();
    }
}

export default new RemoveCommand();
