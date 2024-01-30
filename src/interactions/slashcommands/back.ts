import { GuildQueue, GuildQueueHistory, Track, useHistory, useQueue } from 'discord-player';
import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { BaseSlashCommandInteraction } from '../../classes/interactions';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../types/interactionTypes';
import { checkHistoryExists, checkQueueCurrentTrack } from '../../utils/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../utils/validation/voiceChannelValidator';
import { Logger } from 'pino';
import { localizeCommand, useServerTranslator } from '../../common/localeUtil';
import { TFunction } from 'i18next';
import { formatSlashCommand } from '../../common/formattingUtils';

class BackCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = localizeCommand(
            new SlashCommandBuilder()
                .setName('back')
                .addIntegerOption((option) => option.setName('position').setMinValue(1))
        );
        super(data);
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, interaction } = params;
        const logger = this.getLogger(this.name, executionId, interaction);
        const translator = useServerTranslator(interaction);

        const history: GuildQueueHistory = useHistory(interaction.guild!.id)!;

        await this.runValidators({ interaction, history, executionId }, [
            checkInVoiceChannel,
            checkSameVoiceChannel,
            checkHistoryExists,
            checkQueueCurrentTrack
        ]);

        const backToTrackInput: number = interaction.options.getInteger('position')!;

        if (backToTrackInput) {
            return await this.handleBackToTrackPosition(logger, interaction, history, backToTrackInput, translator);
        } else {
            return await this.handleBackToPreviousTrack(logger, interaction, history, translator);
        }
    }

    private async handleBackToTrackPosition(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        history: GuildQueueHistory,
        backtoTrackPosition: number,
        translator: TFunction
    ) {
        if (backtoTrackPosition > history.tracks.data.length) {
            return await this.handleTrackPositionHigherThanHistoryLength(
                backtoTrackPosition,
                history,
                logger,
                interaction,
                translator
            );
        } else {
            await history.back();
            const recoveredTrack: Track = history.currentTrack! ?? history.tracks.data[backtoTrackPosition - 1];
            logger.debug('Went back to specified track position in history.');
            return await this.respondWithSuccessEmbed(recoveredTrack, interaction, translator);
        }
    }

    private async handleTrackPositionHigherThanHistoryLength(
        backToTrackPosition: number,
        history: GuildQueueHistory,
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        translator: TFunction
    ) {
        logger.debug('Specified track position was higher than total tracks.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        translator('commands.back.trackPositionHigherThanHistoryLength', {
                            icon: this.embedOptions.icons.warning,
                            count: history.tracks.data.length,
                            backPosition: backToTrackPosition,
                            historyCommand: formatSlashCommand('history', translator)
                        })
                    )
                    .setColor(this.embedOptions.colors.warning)
            ]
        });
    }

    private async handleBackToPreviousTrack(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        history: GuildQueueHistory,
        translator: TFunction
    ) {
        if (history.tracks.data.length === 0) {
            return await this.handleNoTracksInHistory(logger, interaction, translator);
        }

        await history.back();
        const queue: GuildQueue = useQueue(interaction.guild!.id)!;
        const currentTrack: Track = queue.currentTrack!;
        logger.debug('Recovered track from history.');
        return await this.respondWithSuccessEmbed(currentTrack, interaction, translator);
    }
    private async handleNoTracksInHistory(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        translator: TFunction
    ) {
        logger.debug('No tracks in history.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        translator('commands.back.trackHistoryEmpty', {
                            icon: this.embedOptions.icons.warning,
                            playCommand: formatSlashCommand('play', translator)
                        })
                    )
                    .setColor(this.embedOptions.colors.warning)
            ]
        });
    }

    private async respondWithSuccessEmbed(
        recoveredTrack: Track,
        interaction: ChatInputCommandInteraction,
        translator: TFunction
    ) {
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(this.getEmbedUserAuthor(interaction))
                    .setDescription(
                        translator('commands.back.trackReplayed', {
                            icon: this.embedOptions.icons.back,
                            track: this.getDisplayTrackDurationAndUrl(recoveredTrack, translator)
                        })
                    )
                    .setThumbnail(this.getTrackThumbnailUrl(recoveredTrack))
                    .setColor(this.embedOptions.colors.success)
            ]
        });
    }
}

export default new BackCommand();
