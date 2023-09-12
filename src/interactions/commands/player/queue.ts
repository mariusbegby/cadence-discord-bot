import config from 'config';
import { GuildQueue, PlayerTimestamp, Track, useQueue } from 'discord-player';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { BaseSlashCommandInteraction } from '../../../classes/interactions';
import { PlayerOptions } from '../../../types/configTypes';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../../types/interactionTypes';
import { checkQueueExists } from '../../../utils/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../../utils/validation/voiceChannelValidator';

const playerOptions: PlayerOptions = config.get('playerOptions');

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

        const pageIndex: number = (interaction.options.getNumber('page') || 1) - 1;
        let queueString: string = '';

        const queueLength: number = queue.tracks.data.length;
        const totalPages: number = Math.ceil(queueLength / 10) || 1;

        if (pageIndex > totalPages - 1) {
            logger.debug('Specified page was higher than total pages.');

            logger.debug('Responding with warning embed.');
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${this.embedOptions.icons.warning} Oops!**\nPage **\`${
                                pageIndex + 1
                            }\`** is not a valid page number.\n\nThere are only a total of **\`${totalPages}\`** pages in the queue.`
                        )
                        .setColor(this.embedOptions.colors.warning)
                ]
            });
        }

        if (queue.tracks.data.length === 0) {
            logger.debug('Queue exists but with no tracks, displaying empty queue.');
            queueString = 'The queue is empty, add some tracks with **`/play`**!';
        } else {
            queueString = queue.tracks.data
                .slice(pageIndex * 10, pageIndex * 10 + 10)
                .map((track, index) => {
                    return `**${pageIndex * 10 + index + 1}.** ${this.getDisplayTrackDurationAndUrl(track)}`;
                })
                .join('\n');
        }

        const currentTrack: Track = queue.currentTrack!;

        const loopModesFormatted = new Map([
            [0, 'disabled'],
            [1, 'track'],
            [2, 'queue'],
            [3, 'autoplay']
        ]);

        const loopModeUserString: string = loopModesFormatted.get(queue.repeatMode)!;

        const getRepeatModeMessage = (repeatMode: number): string => {
            const icon = repeatMode === 3 ? this.embedOptions.icons.autoplay : this.embedOptions.icons.loop;
            return `**${icon} Looping**\nLoop mode is set to **\`${loopModeUserString}\`**. You can change it with **\`/loop\`**.\n\n`;
        };

        const repeatModeString: string = queue.repeatMode === 0 ? '' : getRepeatModeMessage(queue.repeatMode);

        if (!currentTrack) {
            logger.debug('Queue exists but there is no current track.');

            logger.debug('Responding with info embed.');
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor(await this.getEmbedQueueAuthor(interaction, queue))
                        .setDescription(
                            `${repeatModeString}` +
                                `**${this.embedOptions.icons.queue} Tracks in queue**\n${queueString}`
                        )
                        .setFooter({
                            text: `Page ${pageIndex + 1} of ${totalPages} (${queueLength} tracks)`
                        })
                        .setColor(this.embedOptions.colors.info)
                ]
            });
        } else {
            logger.debug('Queue exists with current track, gathering information.');
            const timestamp: PlayerTimestamp = queue.node.getTimestamp()!;
            let bar: string = `**\`${timestamp.current.label}\`** ${queue.node.createProgressBar({
                queue: false,
                length: playerOptions.progressBar.length ?? 12,
                timecodes: playerOptions.progressBar.timecodes ?? false,
                indicator: playerOptions.progressBar.indicator ?? '🔘',
                leftChar: playerOptions.progressBar.leftChar ?? '▬',
                rightChar: playerOptions.progressBar.rightChar ?? '▬'
            })} **\`${timestamp.total.label}\`**`;

            if (Number(currentTrack.raw.duration) === 0 || currentTrack.duration === '0:00') {
                bar = '_No duration available._';
            }

            if (currentTrack.raw.live) {
                bar = `${this.embedOptions.icons.liveTrack} **\`LIVE\`** - Playing continuously from live source.`;
            }

            logger.debug('Responding with info embed.');
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor(await this.getEmbedQueueAuthor(interaction, queue))
                        .setDescription(
                            `**${this.embedOptions.icons.audioPlaying} Now playing**\n` +
                                (currentTrack
                                    ? `**[${currentTrack.title}](${currentTrack.raw.url ?? currentTrack.url})**`
                                    : 'None') +
                                `\nRequested by: <@${currentTrack.requestedBy?.id}>` +
                                `\n ${bar}\n\n` +
                                `${repeatModeString}` +
                                `**${this.embedOptions.icons.queue} Tracks in queue**\n${queueString}`
                        )
                        .setThumbnail(this.getTrackThumbnailUrl(currentTrack))
                        .setFooter({
                            text: `Page ${pageIndex + 1} of ${totalPages} (${queueLength} tracks)`
                        })
                        .setColor(this.embedOptions.colors.info)
                ]
            });
        }
    }
}

export default new QueueCommand();
