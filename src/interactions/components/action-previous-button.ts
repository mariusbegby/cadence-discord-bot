import { GuildQueue, GuildQueueHistory, Track, useHistory, useQueue } from 'discord-player';
import { EmbedBuilder, MessageComponentInteraction } from 'discord.js';
import { BaseComponentInteraction } from '../../classes/interactions';
import { BaseComponentParams, BaseComponentReturnType } from '../../types/interactionTypes';
import { checkQueueCurrentTrack, checkQueueExists } from '../../utils/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../utils/validation/voiceChannelValidator';
import { Logger } from 'pino';

class ActionPreviousButton extends BaseComponentInteraction {
    constructor() {
        super('action-previous-button');
    }

    async execute(params: BaseComponentParams): BaseComponentReturnType {
        const { executionId, interaction, referenceId } = params;
        const logger = this.getLogger(this.name, executionId, interaction);

        const queue: GuildQueue = useQueue(interaction.guild!.id)!;
        const history: GuildQueueHistory = useHistory(interaction.guild!.id)!;

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

        return await this.handleBackToPreviousTrack(logger, interaction, history);
    }

    private async handleBackToPreviousTrack(
        logger: Logger,
        interaction: MessageComponentInteraction,
        history: GuildQueueHistory
    ) {
        if (history.tracks.data.length === 0) {
            return await this.handleNoTracksInHistory(logger, interaction);
        }

        await history.back();
        const queue: GuildQueue = useQueue(interaction.guild!.id)!;
        const currentTrack: Track = queue.currentTrack!;
        logger.debug('Recovered track from history.');
        return await this.handleSuccess(interaction, currentTrack);
    }
    private async handleNoTracksInHistory(logger: Logger, interaction: MessageComponentInteraction) {
        logger.debug('No tracks in history.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${this.embedOptions.icons.warning} Oops!**\n` +
                            'The history is empty, add some tracks with **`/play`**!'
                    )
                    .setColor(this.embedOptions.colors.warning)
            ]
        });
    }

    private async handleNoQueue(interaction: MessageComponentInteraction) {
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${this.embedOptions.icons.warning} Oops!**\nThere is nothing currently playing. First add some tracks with **\`/play\`**!`
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
                        `**${this.embedOptions.icons.warning} Oops!**\nThis track has already been skipped or is no longer playing.`
                    )
                    .setColor(this.embedOptions.colors.warning)
            ],
            components: []
        });
    }

    private async handleSuccess(interaction: MessageComponentInteraction, recoveredTrack: Track) {
        const successEmbed = new EmbedBuilder()
            .setAuthor(this.getEmbedUserAuthor(interaction))
            .setDescription(
                `**${this.embedOptions.icons.back} Recovered track**\n` +
                    `${this.getDisplayTrackDurationAndUrl(recoveredTrack)}`
            )
            .setThumbnail(recoveredTrack.thumbnail)
            .setColor(this.embedOptions.colors.success);

        return await interaction.editReply({
            embeds: [successEmbed],
            components: []
        });
    }
}

export default new ActionPreviousButton();
