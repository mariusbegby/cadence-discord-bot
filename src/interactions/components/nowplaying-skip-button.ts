import { GuildQueue, Track, useQueue } from 'discord-player';
import { EmbedBuilder, MessageComponentInteraction } from 'discord.js';
import { BaseComponentInteraction } from '../../classes/interactions';
import { BaseComponentParams, BaseComponentReturnType } from '../../types/interactionTypes';
import { checkQueueCurrentTrack, checkQueueExists } from '../../utils/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../utils/validation/voiceChannelValidator';

class NowplayingSkipButton extends BaseComponentInteraction {
    constructor() {
        super('nowplaying-skip-button');
    }

    async execute(params: BaseComponentParams): BaseComponentReturnType {
        const { executionId, interaction, referenceId } = params;
        const logger = this.getLogger(this.name, executionId, interaction);

        const queue: GuildQueue = useQueue(interaction.guild!.id)!;

        await this.runValidators({ interaction, queue, executionId }, [
            checkInVoiceChannel,
            checkSameVoiceChannel,
            checkQueueExists,
            checkQueueCurrentTrack
        ]);

        if (!queue || (queue.tracks.data.length === 0 && !queue.currentTrack)) {
            return await this.handleNoQueue(interaction);
        }

        if (queue.currentTrack!.id !== referenceId) {
            return await this.handleAlreadySkipped(interaction);
        }

        const skippedTrack: Track = queue.currentTrack!;
        queue.node.skip();
        logger.debug('Skipped the track.');

        logger.debug('Responding with success embed.');
        return await this.handleSuccess(interaction, skippedTrack, queue);
    }

    private async handleNoQueue(interaction: MessageComponentInteraction) {
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${this.embedOptions.icons.nyctophileZuiMegaphone} | Oops!** Sepertinya ngga ada lagu (tracks) yang sedang di mainkan.`
                    )
                    .setColor(this.embedOptions.colors.warning)
            ],
            components: []
        });
    }

    private async handleAlreadySkipped(interaction: MessageComponentInteraction) {
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${this.embedOptions.icons.nyctophileZuiMegaphone} | Oops!** Sepertiya lagu (tracks) ini sudah di lewati atau tidak lagi di mainkan.`
                    )
                    .setColor(this.embedOptions.colors.warning)
            ],
            components: []
        });
    }

    private async handleSuccess(interaction: MessageComponentInteraction, skippedTrack: Track, queue: GuildQueue) {
        const successEmbed = new EmbedBuilder()
            .setDescription(
                `**${this.embedOptions.icons.skipped} Melewati** lagu (tracks)\n` +
                    `${this.getDisplayTrackDurationAndUrl(skippedTrack)}\n\n` +
                    `${this.getDisplayRepeatMode(queue.repeatMode)}`
            )
            .setColor(this.embedOptions.colors.success);

        return await interaction.editReply({
            embeds: [successEmbed],
            components: []
        });
    }
}

export default new NowplayingSkipButton();
