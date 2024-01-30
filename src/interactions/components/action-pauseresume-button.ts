import { GuildQueue, Track, useQueue } from 'discord-player';
import { EmbedBuilder, MessageComponentInteraction } from 'discord.js';
import { BaseComponentInteraction } from '../../common/classes/interactions';
import { BaseComponentParams, BaseComponentReturnType } from '../../types/interactionTypes';
import { checkQueueCurrentTrack, checkQueueExists } from '../../common/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../common/validation/voiceChannelValidator';
import { TFunction } from 'i18next';
import { useServerTranslator } from '../../common/utils/localeUtil';
import { formatRepeatModeDetailed, formatSlashCommand } from '../../common/utils/formattingUtils';

class ActionPauseResumeButton extends BaseComponentInteraction {
    constructor() {
        super('action-pauseresume-button');
    }

    async execute(params: BaseComponentParams): BaseComponentReturnType {
        const { executionId, interaction, referenceId } = params;
        const logger = this.getLogger(this.name, executionId, interaction);
        const translator = useServerTranslator(interaction);

        const queue: GuildQueue = useQueue(interaction.guild!.id)!;

        await this.runValidators({ interaction, queue, executionId }, [
            checkInVoiceChannel,
            checkSameVoiceChannel,
            checkQueueExists,
            checkQueueCurrentTrack
        ]);

        if (!queue || (queue.tracks.data.length === 0 && !queue.currentTrack)) {
            return await this.handleNoQueue(interaction, translator);
        }

        if (queue.currentTrack!.id !== referenceId) {
            return await this.handleAlreadySkipped(interaction, translator);
        }

        const currentTrack: Track = queue.currentTrack!;
        if (queue.node.isPaused()) {
            queue.node.resume();
            logger.debug('Resumed the track.');
        } else {
            queue.node.pause();
            logger.debug('Paused the track.');
        }

        logger.debug('Responding with success embed.');
        return await this.handleSuccess(interaction, currentTrack, queue, translator);
    }

    private async handleNoQueue(interaction: MessageComponentInteraction, translator: TFunction) {
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        translator('validation.queueNoCurrentTrack', {
                            icon: this.embedOptions.icons.warning,
                            playCommand: formatSlashCommand('play', translator)
                        })
                    )
                    .setColor(this.embedOptions.colors.warning)
            ],
            components: []
        });
    }

    private async handleAlreadySkipped(interaction: MessageComponentInteraction, translator: TFunction) {
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        translator('validation.trackNotPlayingAnymore', {
                            icon: this.embedOptions.icons.warning
                        })
                    )
                    .setColor(this.embedOptions.colors.warning)
            ],
            components: []
        });
    }

    private async handleSuccess(
        interaction: MessageComponentInteraction,
        track: Track,
        queue: GuildQueue,
        translator: TFunction
    ) {
        const successEmbed = new EmbedBuilder()
            .setAuthor(this.getEmbedUserAuthor(interaction))
            .setDescription(
                `**${this.embedOptions.icons.pauseResumed} ${
                    queue.node.isPaused()
                        ? translator('components.responses.paused')
                        : translator('components.responses.resumed')
                }**\n ${this.getDisplayTrackDurationAndUrl(queue.currentTrack!, translator)}\n\n` +
                    `${formatRepeatModeDetailed(queue.repeatMode, this.embedOptions, translator, 'success')}`
            )
            .setThumbnail(track.thumbnail)
            .setColor(this.embedOptions.colors.success);

        return await interaction.editReply({
            embeds: [successEmbed],
            components: []
        });
    }
}

export default new ActionPauseResumeButton();
