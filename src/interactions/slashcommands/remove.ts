import { type GuildQueue, type Track, useQueue } from 'discord-player';
import { type ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { BaseSlashCommandInteraction } from '../../common/classes/interactions';
import type { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../types/interactionTypes';
import { checkQueueExists } from '../../common/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../common/validation/voiceChannelValidator';
import type { Logger } from '../../common/services/logger';
import { localizeCommand, useServerTranslator, type Translator } from '../../common/utils/localeUtil';
import { formatSlashCommand } from '../../common/utils/formattingUtils';

class RemoveCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = localizeCommand(
            new SlashCommandBuilder()
                .setName('remove')
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('track')
                        .addIntegerOption((option) => option.setName('position').setMinValue(1).setRequired(true))
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('range')
                        .addIntegerOption((option) => option.setName('start').setMinValue(1).setRequired(true))
                        .addIntegerOption((option) => option.setName('end').setMinValue(1).setRequired(true))
                )
                .addSubcommand((subcommand) => subcommand.setName('queue'))
                .addSubcommand((subcommand) =>
                    subcommand.setName('user').addUserOption((option) => option.setName('target').setRequired(true))
                )
                .addSubcommand((subcommand) => subcommand.setName('duplicates'))
        );
        super(data);
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, interaction } = params;
        const logger = this.getLogger(this.name, executionId, interaction);
        const translator = useServerTranslator(interaction);

        const queue: GuildQueue = useQueue(interaction.guild!.id)!;

        await this.runValidators({ interaction, queue, executionId }, [
            checkInVoiceChannel,
            checkSameVoiceChannel,
            checkQueueExists
        ]);

        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case 'track':
                return await this.handleRemovedTrack(logger, interaction, queue, translator);
            case 'range':
                return await this.handleRemoveRange(logger, interaction, queue, translator);
            case 'queue':
                return await this.handleRemoveQueue(logger, interaction, queue, translator);
            case 'user':
                return await this.handleRemoveUserTracks(logger, interaction, queue, translator);
            case 'duplicates':
                return await this.handleRemoveDuplicates(logger, interaction, queue, translator);
            default:
                return Promise.resolve();
        }
    }

    private async handleRemoveUserTracks(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        queue: GuildQueue,
        translator: Translator
    ) {
        const targetUser = interaction.options.getUser('target')!;
        const removedTracks: Track[] = [];
        for (const track of queue.tracks.data) {
            if (track.requestedBy?.id === targetUser.id) {
                const removedTrack = queue.node.remove(track);
                if (removedTrack) {
                    removedTracks.push(removedTrack);
                }
            }
        }

        if (removedTracks.length === 0) {
            return await this.handleNoTracksRemoved(logger, interaction, translator);
        }

        logger.debug(`Removed ${removedTracks.length} tracks from queue added by a user.`);

        return await this.handleResponseRemovedTracks(logger, interaction, removedTracks.length, translator);
    }

    private async handleRemoveDuplicates(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        queue: GuildQueue,
        translator: Translator
    ) {
        const removedTracks: Track[] = [];
        const uniqueTrackUrls = new Set<string>();
        for (const track of queue.tracks.data) {
            if (uniqueTrackUrls.has(track.url)) {
                const removedTrack = queue.node.remove(track);
                if (removedTrack) {
                    removedTracks.push(removedTrack);
                }
            } else {
                uniqueTrackUrls.add(track.url);
            }
        }

        if (removedTracks.length === 0) {
            return await this.handleNoTracksRemoved(logger, interaction, translator);
        }

        logger.debug(`Removed ${removedTracks.length} duplicate tracks from queue.`);

        return await this.handleResponseRemovedTracks(logger, interaction, removedTracks.length, translator);
    }

    private async handleRemoveRange(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        queue: GuildQueue,
        translator: Translator
    ) {
        const start: number = interaction.options.getInteger('start')!;
        const end: number = interaction.options.getInteger('end')!;

        if (start > queue.tracks.data.length || end > queue.tracks.data.length) {
            return await this.handleTrackPositionHigherThanQueueLength(logger, interaction, start, queue, translator);
        }
        if (start > end) {
            logger.debug('Start position is higher than end position.');

            logger.debug('Responding with warning embed.');
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            translator('commands.remove.startPositionHigherThanEndPosition', {
                                icon: this.embedOptions.icons.warning,
                                start,
                                end,
                                queueCommand: formatSlashCommand('queue', translator)
                            })
                        )
                        .setColor(this.embedOptions.colors.warning)
                ],
                ephemeral: true
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
            return await this.handleNoTracksRemoved(logger, interaction, translator);
        }

        logger.debug(`Removed ${removedTracks.length} tracks from queue.`);

        return await this.handleResponseRemovedTracks(logger, interaction, removedTracks.length, translator);
    }

    private async handleRemoveQueue(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        queue: GuildQueue,
        translator: Translator
    ) {
        const queueLength = queue.tracks.data.length;
        queue.clear();

        if (queueLength === 0) {
            return await this.handleNoTracksRemoved(logger, interaction, translator);
        }

        logger.debug('Cleared the queue and removed all tracks.');

        return await this.handleResponseRemovedTracks(logger, interaction, queueLength, translator);
    }

    private async handleRemovedTrack(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        queue: GuildQueue,
        translator: Translator
    ) {
        const trackPositionInput: number = interaction.options.getInteger('position')!;

        if (trackPositionInput > queue.tracks.data.length) {
            return await this.handleTrackPositionHigherThanQueueLength(
                logger,
                interaction,
                trackPositionInput,
                queue,
                translator
            );
        }

        const removedTrack: Track = queue.node.remove(trackPositionInput - 1)!;
        logger.debug(`Removed track '${removedTrack.url}' from queue.`);

        logger.debug('Responding with success embed.');
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(this.getEmbedUserAuthor(interaction))
                    .setDescription(
                        `${translator('commands.remove.removedTrack', {
                            icon: this.embedOptions.icons.success
                        })}\n${this.getDisplayTrackDurationAndUrl(removedTrack, translator)}`
                    )
                    .setThumbnail(this.getTrackThumbnailUrl(removedTrack))
                    .setColor(this.embedOptions.colors.success)
            ]
        });
        return Promise.resolve();
    }

    private async handleNoTracksRemoved(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        translator: Translator
    ) {
        logger.debug('Responding with warning embed.');
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(this.getEmbedUserAuthor(interaction))
                    .setDescription(
                        translator('commands.remove.noTracksRemoved', {
                            icon: this.embedOptions.icons.warning
                        })
                    )
                    .setColor(this.embedOptions.colors.warning)
            ],
            ephemeral: true
        });
        return Promise.resolve();
    }

    private async handleResponseRemovedTracks(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        removedAmount: number,
        translator: Translator
    ) {
        logger.debug('Responding with success embed.');
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(this.getEmbedUserAuthor(interaction))
                    .setDescription(
                        translator('commands.remove.removedTracks', {
                            icon: this.embedOptions.icons.success,
                            count: removedAmount
                        })
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
        queue: GuildQueue,
        translator: Translator
    ) {
        logger.debug('Specified track position is higher than total tracks.');

        logger.debug('Responding with warning embed.');
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        translator('commands.skip.trackPositionHigherThanQueueLength', {
                            icon: this.embedOptions.icons.warning,
                            position: trackPositionInput,
                            count: queue.tracks.data.length,
                            queueCommand: formatSlashCommand('queue', translator)
                        })
                    )
                    .setColor(this.embedOptions.colors.warning)
            ],
            ephemeral: true
        });
        return Promise.resolve();
    }
}

export default new RemoveCommand();
