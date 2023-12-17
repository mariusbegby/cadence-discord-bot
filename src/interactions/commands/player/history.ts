import { GuildQueue, GuildQueueHistory, Track, useHistory, useQueue } from 'discord-player';
import {
    APIActionRowComponent,
    APIButtonComponent,
    APIMessageActionRowComponent,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    ComponentType,
    EmbedBuilder,
    EmbedFooterData,
    SlashCommandBuilder
} from 'discord.js';
import { Logger } from 'pino';
import { BaseSlashCommandInteraction } from '../../../classes/interactions';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../../types/interactionTypes';
import { checkHistoryExists } from '../../../utils/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../../utils/validation/voiceChannelValidator';
import { localizeCommand, useServerTranslator } from '../../../common/localeUtil';
import { TFunction } from 'i18next';
import { formatRepeatModeDetailed, formatSlashCommand } from '../../../common/formattingUtils';

class HistoryCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = localizeCommand(
            new SlashCommandBuilder()
                .setName('history')
                .addIntegerOption((option) => option.setName('page').setMinValue(1))
        );
        super(data);
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, interaction } = params;
        const logger = this.getLogger(this.name, executionId, interaction);
        const translator = useServerTranslator(interaction);

        const history: GuildQueueHistory = useHistory(interaction.guild!.id)!;
        const queue: GuildQueue = useQueue(interaction.guild!.id)!;

        await this.runValidators({ interaction, history, executionId }, [
            checkInVoiceChannel,
            checkSameVoiceChannel,
            checkHistoryExists
        ]);

        const pageIndex: number = this.getPageIndex(interaction);
        const totalPages: number = this.getTotalPages(history);

        if (pageIndex > totalPages - 1) {
            return await this.handleInvalidPage(logger, interaction, pageIndex, totalPages, translator);
        }

        const historyTracksListString: string = this.getHistoryTracksListString(history, pageIndex, translator);

        const currentTrack: Track = history.currentTrack!;
        if (currentTrack) {
            return await this.handleCurrentTrack(
                logger,
                interaction,
                queue,
                history,
                currentTrack,
                historyTracksListString,
                translator
            );
        }

        return await this.handleNoCurrentTrack(
            logger,
            interaction,
            queue,
            history,
            historyTracksListString,
            translator
        );
    }

    private async handleCurrentTrack(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        queue: GuildQueue,
        history: GuildQueueHistory,
        currentTrack: Track,
        historyTracksListString: string,
        translator: TFunction
    ) {
        logger.debug('History exists with current track, gathering information.');

        const components: APIMessageActionRowComponent[] = [];

        const previousButton: APIButtonComponent = new ButtonBuilder()
            .setDisabled(queue.history.tracks.data.length > 0 ? false : true)
            .setCustomId(`action-previous-button_${currentTrack.id}`)
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(this.embedOptions.icons.previousTrack)
            .toJSON();
        components.push(previousButton);

        const playPauseButton: APIButtonComponent = new ButtonBuilder()
            .setCustomId(`action-pauseresume-button_${currentTrack.id}`)
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(this.embedOptions.icons.pauseResumeTrack)
            .toJSON();
        components.push(playPauseButton);

        const skipButton: APIButtonComponent = new ButtonBuilder()
            .setCustomId(`action-skip-button_${currentTrack.id}`)
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(this.embedOptions.icons.nextTrack)
            .toJSON();
        components.push(skipButton);

        if (this.embedOptions.components.showButtonLabels) {
            previousButton.label = translator('musicPlayerCommon.controls.previous');
            playPauseButton.label = queue.node.isPaused()
                ? translator('musicPlayerCommon.controls.resume')
                : translator('musicPlayerCommon.controls.pause');
            skipButton.label = translator('musicPlayerCommon.controls.skip');
        }

        const embedActionRow: APIActionRowComponent<APIMessageActionRowComponent> = {
            type: ComponentType.ActionRow,
            components
        };

        logger.debug('Responding with info embed.');
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(this.getEmbedQueueAuthor(interaction, queue, translator))
                    .setDescription(
                        `${translator('musicPlayerCommon.nowPlayingTitle', {
                            icon: this.embedOptions.icons.audioPlaying
                        })}\n` +
                            `${this.getFormattedTrackUrl(currentTrack, translator)}\n` +
                            `${translator('musicPlayerCommon.requestedBy', {
                                user: this.getDisplayTrackRequestedBy(currentTrack, translator)
                            })}\n` +
                            `${this.getDisplayQueueProgressBar(queue, translator)}\n\n` +
                            `${formatRepeatModeDetailed(queue.repeatMode, this.embedOptions, translator)}\n` +
                            `${translator('commands.history.tracksInHistoryTitle', {
                                icon: this.embedOptions.icons.queue
                            })}\n` +
                            historyTracksListString
                    )
                    .setThumbnail(this.getTrackThumbnailUrl(currentTrack))
                    .setFooter(this.getDisplayFullFooterInfo(interaction, history, translator))
                    .setColor(this.embedOptions.colors.info)
            ],
            components: [embedActionRow]
        });
        return Promise.resolve();
    }

    private async handleNoCurrentTrack(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        queue: GuildQueue,
        history: GuildQueueHistory,
        historyTracksListString: string,
        translator: TFunction
    ) {
        logger.debug('History exists but there is no current track.');

        logger.debug('Responding with info embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(this.getEmbedQueueAuthor(interaction, queue, translator))
                    .setDescription(
                        translator('commands.history.tracksInHistoryTitle', {
                            icon: this.embedOptions.icons.queue
                        }) +
                            '\n' +
                            historyTracksListString
                    )
                    .setFooter(this.getDisplayFullFooterInfo(interaction, history, translator))
                    .setColor(this.embedOptions.colors.info)
            ]
        });
    }

    private async handleInvalidPage(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        pageIndex: number,
        totalPages: number,
        translator: TFunction
    ) {
        logger.debug('Specified page was higher than total pages.');

        logger.debug('Responding with warning embed.');
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        translator('commands.history.invalidPageNumber', {
                            icon: this.embedOptions.icons.warning,
                            page: pageIndex + 1,
                            count: totalPages
                        })
                    )
                    .setColor(this.embedOptions.colors.warning)
            ]
        });
        return Promise.resolve();
    }

    private getPageIndex(interaction: ChatInputCommandInteraction): number {
        return (interaction.options.getInteger('page') || 1) - 1;
    }

    private getTotalPages(history: GuildQueueHistory): number {
        return Math.ceil(history.tracks.data.length / 10) || 1;
    }

    private getHistoryTracksListString(history: GuildQueueHistory, pageIndex: number, translator: TFunction): string {
        if (!history || history.tracks.data.length === 0) {
            return translator('commands.history.emptyHistory', {
                playCommand: formatSlashCommand('play', translator)
            });
        }

        return history.tracks.data
            .slice(pageIndex * 10, pageIndex * 10 + 10)
            .map((track, index) => {
                return `**${pageIndex * 10 + index + 1}.** ${this.getDisplayTrackDurationAndUrl(track, translator)}`;
            })
            .join('\n');
    }

    private getDisplayFullFooterInfo(
        interaction: ChatInputCommandInteraction,
        history: GuildQueueHistory,
        translator: TFunction
    ): EmbedFooterData {
        const pagination = this.getFooterDisplayPageInfo(interaction, history, translator);

        const fullFooterData = {
            text: `${pagination.text}`
        };

        return fullFooterData;
    }
}

export default new HistoryCommand();
