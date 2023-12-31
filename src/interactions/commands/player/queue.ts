import { GuildQueue, Track, useQueue } from 'discord-player';
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
import { checkQueueExists } from '../../../utils/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../../utils/validation/voiceChannelValidator';
import { formatDuration, formatRepeatModeDetailed, formatSlashCommand } from '../../../common/formattingUtils';
import { localizeCommand, useServerTranslator } from '../../../common/localeUtil';
import { TFunction } from 'i18next';

class QueueCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = localizeCommand(
            new SlashCommandBuilder()
                .setName('queue')
                .addIntegerOption((option) => option.setName('page').setMinValue(1))
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

        const pageIndex: number = this.getPageIndex(interaction);
        const totalPages: number = this.getTotalPages(queue);

        if (pageIndex > totalPages - 1) {
            return await this.handleInvalidPage(logger, interaction, pageIndex, totalPages, translator);
        }

        const queueTracksListString: string = this.getQueueTracksListString(queue, pageIndex, translator);

        const currentTrack: Track = queue.currentTrack!;
        if (currentTrack) {
            return await this.handleCurrentTrack(
                logger,
                interaction,
                queue,
                currentTrack,
                queueTracksListString,
                translator
            );
        }

        return await this.handleNoCurrentTrack(logger, interaction, queue, queueTracksListString, translator);
    }

    private async handleCurrentTrack(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        queue: GuildQueue,
        currentTrack: Track,
        queueTracksListString: string,
        translator: TFunction
    ) {
        logger.debug('Queue exists with current track, gathering information.');

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
                        this.getDisplayTrackPlayingStatus(queue, translator) +
                            '\n' +
                            this.getFormattedTrackUrl(currentTrack, translator) +
                            '\n' +
                            translator('musicPlayerCommon.requestedBy', {
                                user: this.getDisplayTrackRequestedBy(currentTrack, translator)
                            }) +
                            '\n' +
                            `${this.getDisplayQueueProgressBar(queue, translator)}\n` +
                            `${formatRepeatModeDetailed(queue.repeatMode, this.embedOptions, translator)}\n` +
                            `${translator('commands.queue.tracksInQueueTitle', {
                                icon: this.embedOptions.icons.queue
                            })}\n` +
                            queueTracksListString
                    )
                    .setThumbnail(this.getTrackThumbnailUrl(currentTrack))
                    .setFooter(this.getDisplayFullFooterInfo(interaction, queue, translator))
                    .setColor(this.embedOptions.colors.info)
            ],
            components: [embedActionRow]
        });
        return Promise.resolve();
    }

    private getDisplayTrackPlayingStatus = (queue: GuildQueue, translator: TFunction): string => {
        return queue.node.isPaused()
            ? translator('musicPlayerCommon.nowPausedTitle', { icon: this.embedOptions.icons.paused })
            : translator('musicPlayerCommon.nowPlayingTitle', { icon: this.embedOptions.icons.audioPlaying });
    };

    private async handleNoCurrentTrack(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        queue: GuildQueue,
        queueTracksListString: string,
        translator: TFunction
    ) {
        logger.debug('Queue exists but there is no current track.');

        logger.debug('Responding with info embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(this.getEmbedQueueAuthor(interaction, queue, translator))
                    .setDescription(
                        `${formatRepeatModeDetailed(queue.repeatMode, this.embedOptions, translator)}` +
                            `${translator('commands.queue.tracksInQueueTitle', {
                                icon: this.embedOptions.icons.queue
                            })}\n` +
                            queueTracksListString
                    )
                    .setFooter(this.getDisplayFullFooterInfo(interaction, queue, translator))
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
                        translator('commands.queue.invalidPageNumber', {
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

    private getTotalPages(queue: GuildQueue): number {
        return Math.ceil(queue.tracks.data.length / 10) || 1;
    }

    private getQueueTracksListString(queue: GuildQueue, pageIndex: number, translator: TFunction): string {
        if (!queue || queue.tracks.data.length === 0) {
            return translator('commands.queue.emptyQueue', {
                playCommand: formatSlashCommand('play', translator)
            });
        }

        return queue.tracks.data
            .slice(pageIndex * 10, pageIndex * 10 + 10)
            .map((track, index) => {
                return `**${pageIndex * 10 + index + 1}.** ${this.getDisplayTrackDurationAndUrl(track, translator)}`;
            })
            .join('\n');
    }

    private getDisplayQueueTotalDuration(queue: GuildQueue, translator: TFunction): string {
        if (queue.tracks.data.length > 1000) {
            return translator('commands.queue.estimatedReallyLongTime', {
                playCommand: formatSlashCommand('play', translator)
            });
        }

        let queueDurationMs: number = queue.estimatedDuration;
        if (queue.currentTrack) {
            queueDurationMs += queue.currentTrack.durationMS;
        }

        if (queueDurationMs < 0) {
            return translator('commands.queue.estimatedReallyLongTime', {
                playCommand: formatSlashCommand('play', translator)
            });
        }

        return translator('commands.queue.estimatedDuration', {
            duration: formatDuration(queueDurationMs)
        });
    }

    private getDisplayFullFooterInfo(
        interaction: ChatInputCommandInteraction,
        queue: GuildQueue,
        translator: TFunction
    ): EmbedFooterData {
        const pagination = this.getFooterDisplayPageInfo(interaction, queue, translator);
        const totalDuration = this.getDisplayQueueTotalDuration(queue, translator);

        const fullFooterData = {
            text: `${pagination.text} - ${totalDuration}`
        };

        return fullFooterData;
    }
}

export default new QueueCommand();
