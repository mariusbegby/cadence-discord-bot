import { GuildQueue, Track, useQueue } from 'discord-player';
import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { BaseSlashCommandInteraction } from '../../../classes/interactions';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../../types/interactionTypes';
import { checkQueueCurrentTrack, checkQueueExists } from '../../../utils/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../../utils/validation/voiceChannelValidator';
import { Logger } from 'pino';

class SkipCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = new SlashCommandBuilder()
            .setName('skip')
            .setDescription('Skip track to next or specified position in queue.')
            .addIntegerOption((option) =>
                option.setName('position').setDescription('The position in queue to skip to.').setMinValue(1)
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
            checkQueueExists,
            checkQueueCurrentTrack
        ]);

        const trackPositionInput: number = interaction.options.getInteger('position')!;

        if (trackPositionInput) {
            return await this.handleSkipToTrackPosition(logger, interaction, queue, trackPositionInput);
        } else {
            return await this.handleSkipToNextTrack(logger, interaction, queue);
        }
    }

    private async handleSkipToTrackPosition(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        queue: GuildQueue,
        trackPosition: number
    ) {
        if (trackPosition > queue.tracks.data.length) {
            return await this.handleTrackPositionHigherThanQueueLength(trackPosition, queue, logger, interaction);
        } else {
            const skippedTrack: Track = queue.currentTrack!;
            queue.node.skipTo(trackPosition - 1);
            logger.debug('Skipped to specified track position.');
            return await this.respondWithSuccessEmbed(skippedTrack, interaction);
        }
    }

    private async handleTrackPositionHigherThanQueueLength(
        trackPosition: number,
        queue: GuildQueue,
        logger: Logger,
        interaction: ChatInputCommandInteraction
    ) {
        logger.debug('Specified track position was higher than total tracks.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${this.embedOptions.icons.warning} Oops!**\n` +
                            `There are only **\`${queue.tracks.data.length}\`** tracks in the queue. You cannot skip to track **\`${trackPosition}\`**.\n\n` +
                            'View tracks added to the queue with **`/queue`**.'
                    )
                    .setColor(this.embedOptions.colors.warning)
            ]
        });
    }

    private async handleSkipToNextTrack(logger: Logger, interaction: ChatInputCommandInteraction, queue: GuildQueue) {
        if (queue.tracks.data.length === 0 && !queue.currentTrack) {
            return await this.handleNoTracksInQueueAndNoCurrentTrack(logger, interaction);
        }

        const skippedTrack: Track = queue.currentTrack!;
        queue.node.skip();
        logger.debug('Skipped current track.');
        return await this.respondWithSuccessEmbed(skippedTrack, interaction);
    }

    private async handleNoTracksInQueueAndNoCurrentTrack(logger: Logger, interaction: ChatInputCommandInteraction) {
        logger.debug('No tracks in queue and no current track.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${this.embedOptions.icons.warning} Oops!**\n` +
                            'The queue is empty, add some tracks with **`/play`**!'
                    )
                    .setColor(this.embedOptions.colors.warning)
            ]
        });
    }

    private async respondWithSuccessEmbed(skippedTrack: Track, interaction: ChatInputCommandInteraction) {
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(this.getEmbedUserAuthor(interaction))
                    .setDescription(
                        `**${this.embedOptions.icons.skipped} Skipped track**\n` +
                            `${this.getDisplayTrackDurationAndUrl(skippedTrack)}`
                    )
                    .setThumbnail(this.getTrackThumbnailUrl(skippedTrack))
                    .setColor(this.embedOptions.colors.success)
            ]
        });
    }
}

export default new SkipCommand();
