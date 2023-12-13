import { GuildQueue, GuildQueueHistory, Track, useHistory, useQueue } from 'discord-player';
import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { BaseSlashCommandInteraction } from '../../../classes/interactions';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../../types/interactionTypes';
import { checkHistoryExists, checkQueueCurrentTrack } from '../../../utils/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../../utils/validation/voiceChannelValidator';
import { Logger } from 'pino';

class BackCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = new SlashCommandBuilder()
            .setName('back')
            .setDescription('Go back to previous track or specified position in history.')
            .addIntegerOption((option) =>
                option.setName('position').setDescription('The position in history to go back to.').setMinValue(1)
            );
        super(data);
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, interaction } = params;
        const logger = this.getLogger(this.name, executionId, interaction);

        const history: GuildQueueHistory = useHistory(interaction.guild!.id)!;

        await this.runValidators({ interaction, history, executionId }, [
            checkInVoiceChannel,
            checkSameVoiceChannel,
            checkHistoryExists,
            checkQueueCurrentTrack
        ]);

        const backToTrackInput: number = interaction.options.getInteger('position')!;

        if (backToTrackInput) {
            return await this.handleBackToTrackPosition(logger, interaction, history, backToTrackInput);
        } else {
            return await this.handleBackToPreviousTrack(logger, interaction, history);
        }
    }

    private async handleBackToTrackPosition(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        history: GuildQueueHistory,
        backtoTrackPosition: number
    ) {
        if (backtoTrackPosition > history.tracks.data.length) {
            return await this.handleTrackPositionHigherThanQueueLength(
                backtoTrackPosition,
                history,
                logger,
                interaction
            );
        } else {
            await history.back();
            const recoveredTrack: Track = history.currentTrack! ?? history.tracks.data[backtoTrackPosition - 1];
            logger.debug('Went back to specified track position in history.');
            return await this.respondWithSuccessEmbed(recoveredTrack, interaction);
        }
    }

    private async handleTrackPositionHigherThanQueueLength(
        backToTrackPosition: number,
        history: GuildQueueHistory,
        logger: Logger,
        interaction: ChatInputCommandInteraction
    ) {
        logger.debug('Specified track position was higher than total tracks.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${this.embedOptions.icons.warning} Oops!**\n` +
                            `There are only **\`${history.tracks.data.length}\`** tracks in the history. You cannot go back to track **\`${backToTrackPosition}\`**.\n\n` +
                            'View tracks added in the history with **`/history`**.'
                    )
                    .setColor(this.embedOptions.colors.warning)
            ]
        });
    }

    private async handleBackToPreviousTrack(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        history: GuildQueueHistory
    ) {
        if (history.tracks.data.length === 0) {
            return await this.handleNoTracksInHistory(logger, interaction);
        }

        await history.back();
        const queue: GuildQueue = useQueue(interaction.guild!.id)!;
        const currentTrack: Track = queue.currentTrack!;
        logger.debug('Recovered track from history.');
        return await this.respondWithSuccessEmbed(currentTrack, interaction);
    }
    private async handleNoTracksInHistory(logger: Logger, interaction: ChatInputCommandInteraction) {
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

    private async respondWithSuccessEmbed(recoveredTrack: Track, interaction: ChatInputCommandInteraction) {
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(this.getEmbedUserAuthor(interaction))
                    .setDescription(
                        `**${this.embedOptions.icons.back} Recovered track**\n` +
                            `${this.getDisplayTrackDurationAndUrl(recoveredTrack)}`
                    )
                    .setThumbnail(this.getTrackThumbnailUrl(recoveredTrack))
                    .setColor(this.embedOptions.colors.success)
            ]
        });
    }
}

export default new BackCommand();
