import { GuildQueue, Track, useQueue } from 'discord-player';
import { ChatInputCommandInteraction, EmbedBuilder, EmbedFooterData, SlashCommandBuilder } from 'discord.js';
import { Logger } from 'pino';
import { BaseSlashCommandInteraction } from '../../../classes/interactions';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../../types/interactionTypes';
import { checkQueueExists } from '../../../utils/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../../utils/validation/voiceChannelValidator';
import { formatDuration } from '../../../common/formattingUtils';

class QueueCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = new SlashCommandBuilder()
            .setName('queue')
            .setDescription('Show tracks that have been added to the queue.')
            .addNumberOption((option) =>
                option.setName('page').setDescription('Page number to display for the queue').setMinValue(1)
            );
        super(data);
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, interaction } = params;
        const logger = this.getLogger(this.name, executionId, interaction);

        const queue: GuildQueue = useQueue(interaction.guild!.id)!;

        await this.runValidators({ interaction, queue, executionId }, [
            checkInVoiceChannel,
            checkSameVoiceChannel,
            checkQueueExists
        ]);

        const pageIndex: number = this.getPageIndex(interaction);
        const totalPages: number = this.getTotalPages(queue);

        if (pageIndex > totalPages - 1) {
            return await this.handleInvalidPage(logger, interaction, pageIndex, totalPages);
        }

        const queueTracksListString: string = this.getQueueTracksListString(queue, pageIndex);

        const currentTrack: Track = queue.currentTrack!;
        if (currentTrack) {
            return await this.handleCurrentTrack(logger, interaction, queue, currentTrack, queueTracksListString);
        }

        return await this.handleNoCurrentTrack(logger, interaction, queue, queueTracksListString);
    }

    private async handleCurrentTrack(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        queue: GuildQueue,
        currentTrack: Track,
        queueTracksListString: string
    ) {
        logger.debug('Queue exists with current track, gathering information.');

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
                            `**${this.embedOptions.icons.queue} Tracks in queue**\n` +
                            queueTracksListString
                    )
                    .setThumbnail(this.getTrackThumbnailUrl(currentTrack))
                    .setFooter(this.getDisplayFullFooterInfo(interaction, queue))
                    .setColor(this.embedOptions.colors.info)
            ]
        });
        return Promise.resolve();
    }

    private async handleNoCurrentTrack(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        queue: GuildQueue,
        queueTracksListString: string
    ) {
        logger.debug('Queue exists but there is no current track.');

        logger.debug('Responding with info embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(this.getEmbedQueueAuthor(interaction, queue))
                    .setDescription(
                        `${this.getDisplayRepeatMode(queue.repeatMode)}` +
                            `**${this.embedOptions.icons.queue} Tracks in queue**\n` +
                            queueTracksListString
                    )
                    .setFooter(this.getDisplayFullFooterInfo(interaction, queue))
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
                            `There are only a total of **\`${totalPages}\`** pages in the queue.`
                    )
                    .setColor(this.embedOptions.colors.warning)
            ]
        });
        return Promise.resolve();
    }

    private getPageIndex(interaction: ChatInputCommandInteraction): number {
        return (interaction.options.getNumber('page') || 1) - 1;
    }

    private getTotalPages(queue: GuildQueue): number {
        return Math.ceil(queue.tracks.data.length / 10) || 1;
    }

    private getQueueTracksListString(queue: GuildQueue, pageIndex: number): string {
        if (!queue || queue.tracks.data.length === 0) {
            return 'The queue is empty, add some tracks with **`/play`**!';
        }

        return queue.tracks.data
            .slice(pageIndex * 10, pageIndex * 10 + 10)
            .map((track, index) => {
                return `**${pageIndex * 10 + index + 1}.** ${this.getDisplayTrackDurationAndUrl(track)}`;
            })
            .join('\n');
    }

    private getDisplayQueueTotalDuration(queue: GuildQueue): string {
        if (queue.tracks.data.length > 1000) {
            return 'Estimated duration: A really long time';
        }

        let queueDurationMs: number = queue.estimatedDuration;
        if (queue.currentTrack) {
            queueDurationMs += queue.currentTrack.durationMS;
        }

        if (queueDurationMs < 0) {
            return 'Estimated duration: A really long time';
        }

        return `Estimated duration: ${formatDuration(queueDurationMs)}`;
    }

    private getDisplayFullFooterInfo(interaction: ChatInputCommandInteraction, queue: GuildQueue): EmbedFooterData {
        const pagination = this.getFooterDisplayPageInfo(interaction, queue);
        const totalDuration = this.getDisplayQueueTotalDuration(queue);

        const fullFooterData = {
            text: `${pagination.text} - ${totalDuration}`
        };

        return fullFooterData;
    }
}

export default new QueueCommand();
