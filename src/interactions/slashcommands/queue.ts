import { type GuildQueue, type Track, useQueue } from 'discord-player';
import {
    type APIActionRowComponent,
    type APIMessageActionRowComponent,
    type ChatInputCommandInteraction,
    ComponentType,
    EmbedBuilder,
    type EmbedFooterData,
    SlashCommandBuilder
} from 'discord.js';
import type { Logger } from '../../common/services/logger';
import { BaseSlashCommandInteraction } from '../../common/classes/interactions';
import type { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../types/interactionTypes';
import { checkQueueExists } from '../../common/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../common/validation/voiceChannelValidator';
import { formatDuration, formatRepeatModeDetailed, formatSlashCommand } from '../../common/utils/formattingUtils';
import { localizeCommand, useServerTranslator, type Translator } from '../../common/utils/localeUtil';
import { createNewActionButton } from '../../common/utils/createActionButton';

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
        translator: Translator
    ) {
        logger.debug('Queue exists with current track, gathering information.');

        logger.debug('Responding with info embed.');
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(this.getEmbedQueueAuthor(interaction, queue, translator))
                    .setDescription(
                        `${this.getDisplayTrackPlayingStatus(queue, translator)}\n${this.getFormattedTrackUrl(currentTrack, translator)}\n${translator(
                            'musicPlayerCommon.requestedBy',
                            {
                                user: this.getDisplayTrackRequestedBy(currentTrack, translator)
                            }
                        )}\n${this.getDisplayQueueProgressBar(queue, translator)}\n${formatRepeatModeDetailed(queue.repeatMode, this.embedOptions, translator)}\n${translator(
                            'commands.queue.tracksInQueueTitle',
                            {
                                icon: this.embedOptions.icons.queue
                            }
                        )}\n${queueTracksListString}`
                    )
                    .setThumbnail(this.getTrackThumbnailUrl(currentTrack))
                    .setFooter(this.getDisplayFullFooterInfo(interaction, queue, translator))
                    .setColor(this.embedOptions.colors.info)
            ],
            components: [this.createEmbedActionRow(currentTrack, queue, translator)]
        });
        return Promise.resolve();
    }

    private getDisplayTrackPlayingStatus = (queue: GuildQueue, translator: Translator): string => {
        return queue.node.isPaused()
            ? translator('musicPlayerCommon.nowPausedTitle', { icon: this.embedOptions.icons.paused })
            : translator('musicPlayerCommon.nowPlayingTitle', { icon: this.embedOptions.icons.audioPlaying });
    };

    private async handleNoCurrentTrack(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        queue: GuildQueue,
        queueTracksListString: string,
        translator: Translator
    ) {
        logger.debug('Queue exists but there is no current track.');

        logger.debug('Responding with info embed.');
        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(this.getEmbedQueueAuthor(interaction, queue, translator))
                    .setDescription(
                        `${formatRepeatModeDetailed(queue.repeatMode, this.embedOptions, translator)}${translator(
                            'commands.queue.tracksInQueueTitle',
                            {
                                icon: this.embedOptions.icons.queue
                            }
                        )}\n${queueTracksListString}`
                    )
                    .setFooter(this.getDisplayFullFooterInfo(interaction, queue, translator))
                    .setColor(this.embedOptions.colors.info)
            ],
            ephemeral: true
        });
    }

    private async handleInvalidPage(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        pageIndex: number,
        totalPages: number,
        translator: Translator
    ) {
        logger.debug('Specified page was higher than total pages.');

        logger.debug('Responding with warning embed.');
        await interaction.reply({
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
            ],
            ephemeral: true
        });
        return Promise.resolve();
    }

    private getPageIndex(interaction: ChatInputCommandInteraction): number {
        return (interaction.options.getInteger('page') || 1) - 1;
    }

    private getTotalPages(queue: GuildQueue): number {
        return Math.ceil(queue.tracks.data.length / 10) || 1;
    }

    private getQueueTracksListString(queue: GuildQueue, pageIndex: number, translator: Translator): string {
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

    private getDisplayQueueTotalDuration(queue: GuildQueue, translator: Translator): string {
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
        translator: Translator
    ): EmbedFooterData {
        const pagination = this.getFooterDisplayPageInfo(interaction, queue, translator);
        const totalDuration = this.getDisplayQueueTotalDuration(queue, translator);

        const fullFooterData = {
            text: `${pagination.text} - ${totalDuration}`
        };

        return fullFooterData;
    }

    private createEmbedActionRow(
        currentTrack: Track,
        queue: GuildQueue,
        translator: Translator
    ): APIActionRowComponent<APIMessageActionRowComponent> {
        const embedActionRow: APIActionRowComponent<APIMessageActionRowComponent> = {
            type: ComponentType.ActionRow,
            components: []
        };

        const previousButton = createNewActionButton(
            `action-previous-button_${currentTrack.id}`,
            this.embedOptions.icons.previousTrack,
            embedActionRow
        );

        const playPauseButton = createNewActionButton(
            `action-pauseresume-button_${currentTrack.id}`,
            this.embedOptions.icons.pauseResumeTrack,
            embedActionRow
        );

        const skipButton = createNewActionButton(
            `action-skip-button_${currentTrack.id}`,
            this.embedOptions.icons.nextTrack,
            embedActionRow
        );

        if (this.embedOptions.components.showButtonLabels) {
            previousButton.label = translator('musicPlayerCommon.controls.previous');
            playPauseButton.label = queue.node.isPaused()
                ? translator('musicPlayerCommon.controls.resume')
                : translator('musicPlayerCommon.controls.pause');
            skipButton.label = translator('musicPlayerCommon.controls.skip');
        }

        return embedActionRow;
    }
}

export default new QueueCommand();
