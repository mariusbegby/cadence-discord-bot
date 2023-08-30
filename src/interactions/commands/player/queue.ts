import config from 'config';
import { GuildQueue, PlayerTimestamp, Track, useQueue } from 'discord-player';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Logger } from 'pino';
import loggerModule from '../../../services/logger';
import { EmbedOptions, PlayerOptions } from '../../../types/configTypes';
import { BaseSlashCommandInteraction } from '../../../types/interactionTypes';
import { queueDoesNotExist } from '../../../utils/validation/queueValidator';
import { notInSameVoiceChannel, notInVoiceChannel } from '../../../utils/validation/voiceChannelValidator';

const embedOptions: EmbedOptions = config.get('embedOptions');
const playerOptions: PlayerOptions = config.get('playerOptions');

const command: BaseSlashCommandInteraction = {
    isNew: false,
    isBeta: false,
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Show the list of tracks added to the queue.')
        .setDMPermission(false)
        .setNSFW(false)
        .addNumberOption((option) => option.setName('page').setDescription('Page number of the queue').setMinValue(1)),
    execute: async ({ interaction, executionId }) => {
        const logger: Logger = loggerModule.child({
            source: 'queue.js',
            module: 'slashCommand',
            name: '/queue',
            executionId: executionId,
            shardId: interaction.guild?.shardId,
            guildId: interaction.guild?.id
        });

        const queue: GuildQueue = useQueue(interaction.guild!.id)!;

        const validators = [
            () => notInVoiceChannel({ interaction, executionId }),
            () => notInSameVoiceChannel({ interaction, queue, executionId }),
            () => queueDoesNotExist({ interaction, queue, executionId })
        ];

        for (const validator of validators) {
            if (await validator()) {
                return;
            }
        }

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
                            `**${embedOptions.icons.warning} Oops!**\nPage **\`${
                                pageIndex + 1
                            }\`** is not a valid page number.\n\nThere are only a total of **\`${totalPages}\`** pages in the queue.`
                        )
                        .setColor(embedOptions.colors.warning)
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
                    let durationFormat =
                        Number(track.raw.duration) === 0 || track.duration === '0:00' ? '' : `\`${track.duration}\``;

                    if (track.raw.live) {
                        durationFormat = `${embedOptions.icons.liveTrack} \`LIVE\``;
                    }

                    return `**${pageIndex * 10 + index + 1}.** **${durationFormat} [${track.title}](${
                        track.raw.url ?? track.url
                    })**`;
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

        const repeatModeString: string = `${
            queue.repeatMode === 0
                ? ''
                : `**${
                    queue.repeatMode === 3 ? embedOptions.icons.autoplay : embedOptions.icons.loop
                } Looping**\nLoop mode is set to **\`${loopModeUserString}\`**. You can change it with **\`/loop\`**.\n\n`
        }`;

        if (!currentTrack) {
            logger.debug('Queue exists but there is no current track.');

            logger.debug('Responding with info embed.');
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: `Channel: ${queue.channel!.name} (${queue.channel!.bitrate / 1000}kbps)`,
                            iconURL: interaction.guild!.iconURL() || embedOptions.info.fallbackIconUrl
                        })
                        .setDescription(
                            `${repeatModeString}` + `**${embedOptions.icons.queue} Tracks in queue**\n${queueString}`
                        )
                        .setFooter({
                            text: `Page ${pageIndex + 1} of ${totalPages} (${queueLength} tracks)`
                        })
                        .setColor(embedOptions.colors.info)
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
                bar = `${embedOptions.icons.liveTrack} **\`LIVE\`** - Playing continuously from live source.`;
            }

            logger.debug('Responding with info embed.');
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: `Channel: ${queue.channel!.name} (${queue.channel!.bitrate / 1000}kbps)`,
                            iconURL: interaction.guild!.iconURL() || embedOptions.info.fallbackIconUrl
                        })
                        .setDescription(
                            `**${embedOptions.icons.audioPlaying} Now playing**\n` +
                                (currentTrack
                                    ? `**[${currentTrack.title}](${currentTrack.raw.url ?? currentTrack.url})**`
                                    : 'None') +
                                `\nRequested by: <@${currentTrack.requestedBy?.id}>` +
                                `\n ${bar}\n\n` +
                                `${repeatModeString}` +
                                `**${embedOptions.icons.queue} Tracks in queue**\n${queueString}`
                        )
                        .setThumbnail(currentTrack.thumbnail)
                        .setFooter({
                            text: `Page ${pageIndex + 1} of ${totalPages} (${queueLength} tracks)`
                        })
                        .setColor(embedOptions.colors.info)
                ]
            });
        }
    }
};

export default command;
