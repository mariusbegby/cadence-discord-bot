import { type GuildQueue, type GuildQueueHistory, type Track, useHistory, useQueue } from 'discord-player';
import { EmbedBuilder, type MessageComponentInteraction } from 'discord.js';
import { BaseComponentInteraction } from '../../common/classes/interactions';
import type { BaseComponentParams, BaseComponentReturnType } from '../../types/interactionTypes';
import { checkQueueCurrentTrack, checkQueueExists } from '../../common/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../common/validation/voiceChannelValidator';
import type { Logger } from '../../common/services/logger';
import { useServerTranslator, type Translator } from '../../common/utils/localeUtil';
import { formatSlashCommand } from '../../common/utils/formattingUtils';

class ActionPreviousButton extends BaseComponentInteraction {
    constructor() {
        super('action-previous-button');
    }

    async execute(params: BaseComponentParams): BaseComponentReturnType {
        const { executionId, interaction, referenceId } = params;
        const logger = this.getLogger(this.name, executionId, interaction);
        const translator = useServerTranslator(interaction);

        const queue: GuildQueue = useQueue(interaction.guild!.id)!;
        const history: GuildQueueHistory = useHistory(interaction.guild!.id)!;

        await this.runValidators({ interaction, queue, executionId }, [
            checkInVoiceChannel,
            checkSameVoiceChannel,
            checkQueueExists,
            checkQueueCurrentTrack
        ]);

        if (queue.currentTrack!.id !== referenceId) {
            return await this.handleAlreadySkipped(interaction, translator);
        }

        return await this.handleBackToPreviousTrack(logger, interaction, history, translator);
    }

    private async handleBackToPreviousTrack(
        logger: Logger,
        interaction: MessageComponentInteraction,
        history: GuildQueueHistory,
        translator: Translator
    ) {
        if (history.tracks.data.length === 0) {
            return await this.handleNoTracksInHistory(logger, interaction, translator);
        }

        await history.back();
        const queue: GuildQueue = useQueue(interaction.guild!.id)!;
        const currentTrack: Track = queue.currentTrack!;
        logger.debug('Recovered track from history.');
        return await this.handleSuccess(interaction, currentTrack, translator);
    }
    private async handleNoTracksInHistory(
        logger: Logger,
        interaction: MessageComponentInteraction,
        translator: Translator
    ) {
        logger.debug('No tracks in history.');
        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        translator('commands.back.trackHistoryEmpty', {
                            icon: this.embedOptions.icons.warning,
                            playCommand: formatSlashCommand('play', translator)
                        })
                    )
                    .setColor(this.embedOptions.colors.warning)
            ],
            ephemeral: true
        });
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
        recoveredTrack: Track,
        translator: Translator
    ) {
        const successEmbed = new EmbedBuilder()
            .setAuthor(this.getEmbedUserAuthor(interaction))
            .setDescription(
                translator('commands.back.trackReplayed', {
                    icon: this.embedOptions.icons.back,
                    track: this.getDisplayTrackDurationAndUrl(recoveredTrack, translator)
                })
            )
            .setThumbnail(recoveredTrack.thumbnail)
            .setColor(this.embedOptions.colors.success);

        return await interaction.reply({
            embeds: [successEmbed],
            components: []
        });
    }
}

export default new ActionPreviousButton();
