import { GuildQueue, Track, useQueue } from 'discord-player';
import { EmbedBuilder, MessageComponentInteraction } from 'discord.js';
import { BaseComponentInteraction } from '../../common/classes/interactions';
import { BaseComponentParams, BaseComponentReturnType } from '../../types/interactionTypes';
import { checkQueueCurrentTrack, checkQueueExists } from '../../common/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../common/validation/voiceChannelValidator';
import { useServerTranslator, Translator } from '../../common/utils/localeUtil';
import { formatRepeatModeDetailed } from '../../common/utils/formattingUtils';

class ActionSkipButton extends BaseComponentInteraction {
    constructor() {
        super('action-skip-button');
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

        if (queue.currentTrack!.id !== referenceId) {
            return await this.handleAlreadySkipped(interaction, translator);
        }

        const skippedTrack: Track = queue.currentTrack!;
        queue.node.skip();
        logger.debug('Skipped the track.');

        logger.debug('Responding with success embed.');
        return await this.handleSuccess(interaction, skippedTrack, queue, translator);
    }

    private async handleAlreadySkipped(interaction: MessageComponentInteraction, translator: Translator) {
        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        translator('validation.trackNotPlayingAnymore', {
                            icon: this.embedOptions.icons.warning
                        })
                    )
                    .setColor(this.embedOptions.colors.warning)
            ],
            components: [],
            ephemeral: true
        });
    }

    private async handleSuccess(
        interaction: MessageComponentInteraction,
        skippedTrack: Track,
        queue: GuildQueue,
        translator: Translator
    ) {
        const successEmbed = new EmbedBuilder()
            .setAuthor(this.getEmbedUserAuthor(interaction))
            .setDescription(
                translator('commands.skip.skippedTrack', {
                    icon: this.embedOptions.icons.skipped
                }) +
                    '\n' +
                    `${this.getDisplayTrackDurationAndUrl(skippedTrack, translator)}\n` +
                    `${formatRepeatModeDetailed(queue.repeatMode, this.embedOptions, translator, 'success')}`
            )
            .setThumbnail(skippedTrack.thumbnail)
            .setColor(this.embedOptions.colors.success);

        return await interaction.reply({
            embeds: [successEmbed],
            components: []
        });
    }
}

export default new ActionSkipButton();
