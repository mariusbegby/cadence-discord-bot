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

class HistoryCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = new SlashCommandBuilder()
            .setName('history')
            .setDescription('Show history of tracks that have been played.')
            .addIntegerOption((option) =>
                option.setName('page').setDescription('Page number to display for the history').setMinValue(1)
            );
        super(data);
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, interaction } = params;
        const logger = this.getLogger(this.name, executionId, interaction);

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
            return await this.handleInvalidPage(logger, interaction, pageIndex, totalPages);
        }

        const historyTracksListString: string = this.getHistoryTracksListString(history, pageIndex);

        const currentTrack: Track = history.currentTrack!;
        if (currentTrack) {
            return await this.handleCurrentTrack(
                logger,
                interaction,
                queue,
                history,
                currentTrack,
                historyTracksListString
            );
        }

        return await this.handleNoCurrentTrack(logger, interaction, queue, history, historyTracksListString);
    }

    private async handleCurrentTrack(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        queue: GuildQueue,
        history: GuildQueueHistory,
        currentTrack: Track,
        historyTracksListString: string
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
            previousButton.label = 'Previous';
            playPauseButton.label = queue.node.isPaused() ? 'Resume' : 'Pause';
            skipButton.label = 'Skip';
        }

        const embedActionRow: APIActionRowComponent<APIMessageActionRowComponent> = {
            type: ComponentType.ActionRow,
            components
        };

        logger.debug('Responding with info embed.');
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(this.getEmbedQueueAuthor(interaction, queue))
                    .setDescription(
                        `**${this.embedOptions.icons.audioPlaying} Now playing**\n` +
                            `${this.getFormattedTrackUrl(currentTrack)}\n` +
                            `**Requested by:** ${this.getDisplayTrackRequestedBy(currentTrack)}\n` +
                            `${this.getDisplayQueueProgressBar(queue)}\n\n` +
                            `${this.getDisplayRepeatMode(queue.repeatMode)}` +
                            `**${this.embedOptions.icons.queue} Tracks in history**\n` +
                            historyTracksListString
                    )
                    .setThumbnail(this.getTrackThumbnailUrl(currentTrack))
                    .setFooter(this.getDisplayFullFooterInfo(interaction, history))
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
        historyTracksListString: string
    ) {
        logger.debug('History exists but there is no current track.');

        logger.debug('Responding with info embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(this.getEmbedQueueAuthor(interaction, queue))
                    .setDescription(
                        `${this.getDisplayRepeatMode(queue.repeatMode)}` +
                            `**${this.embedOptions.icons.queue} Tracks in history**\n` +
                            historyTracksListString
                    )
                    .setFooter(this.getDisplayFullFooterInfo(interaction, history))
                    .setColor(this.embedOptions.colors.info)
            ]
        });
    }

    private async handleInvalidPage(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        pageIndex: number,
        totalPages: number
    ) {
        logger.debug('Specified page was higher than total pages.');

        logger.debug('Responding with warning embed.');
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${this.embedOptions.icons.warning} Oops!**\n` +
                            `Page **\`${pageIndex + 1}\`** is not a valid page number.\n\n` +
                            `There are only a total of **\`${totalPages}\`** pages in the history.`
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

    private getHistoryTracksListString(history: GuildQueueHistory, pageIndex: number): string {
        if (!history || history.tracks.data.length === 0) {
            return 'The history is empty, add some tracks with **`/play`**!';
        }

        return history.tracks.data
            .slice(pageIndex * 10, pageIndex * 10 + 10)
            .map((track, index) => {
                return `**${pageIndex * 10 + index + 1}.** ${this.getDisplayTrackDurationAndUrl(track)}`;
            })
            .join('\n');
    }

    private getDisplayFullFooterInfo(
        interaction: ChatInputCommandInteraction,
        history: GuildQueueHistory
    ): EmbedFooterData {
        const pagination = this.getFooterDisplayPageInfo(interaction, history);

        const fullFooterData = {
            text: `${pagination.text}`
        };

        return fullFooterData;
    }
}

export default new HistoryCommand();
