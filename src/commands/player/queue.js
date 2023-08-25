const logger = require('../../services/logger');
const config = require('config');
const embedOptions = config.get('embedOptions');
const playerOptions = config.get('playerOptions');
const { notInVoiceChannel, notInSameVoiceChannel } = require('../../utils/validation/voiceChannelValidator');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    isNew: false,
    isBeta: false,
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Show the list of tracks added to the queue.')
        .setDMPermission(false)
        .setNSFW(false)
        .addNumberOption((option) => option.setName('page').setDescription('Page number of the queue').setMinValue(1)),
    execute: async ({ interaction }) => {
        if (await notInVoiceChannel(interaction)) {
            return;
        }

        const queue = useQueue(interaction.guild.id);

        if (await notInSameVoiceChannel(interaction, queue)) {
            return;
        }

        const pageIndex = (interaction.options.getNumber('page') || 1) - 1;
        let queueString = '';

        if (!queue) {
            if (pageIndex >= 1) {
                logger.debug(
                    `[Shard ${interaction.guild.shardId}] User used command ${interaction.commandName} but there was no queue.`
                );
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(
                                `**${embedOptions.icons.warning} Oops!**\nPage \`${
                                    pageIndex + 1
                                }\` is not a valid page number.\n\nThe queue is currently empty, first add some tracks with **\`/play\`**!`
                            )
                            .setColor(embedOptions.colors.warning)
                    ]
                });
            }

            logger.debug(
                `[Shard ${interaction.guild.shardId}] User used command ${interaction.commandName} but there was no queue.`
            );
            queueString = 'The queue is empty, add some tracks with **`/play`**!';
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: interaction.guild.name,
                            iconURL: interaction.guild.iconURL()
                        })
                        .setDescription(`**${embedOptions.icons.queue} Tracks in queue**\n${queueString}`)
                        .setColor(embedOptions.colors.info)
                        .setFooter({
                            text: 'Page 1 of 1 (0 tracks)'
                        })
                ]
            });
        }

        const queueLength = queue.tracks.data.length;
        const totalPages = Math.ceil(queueLength / 10) || 1;

        if (pageIndex > totalPages - 1) {
            logger.debug(
                `[Shard ${interaction.guild.shardId}] User used command ${interaction.commandName} but page was higher than total pages.`
            );

            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${embedOptions.icons.warning} Oops!**\nPage \`${
                                pageIndex + 1
                            }\` is not a valid page number.\n\nThere are only a total of \`${totalPages}\` pages in the queue.`
                        )
                        .setColor(embedOptions.colors.warning)
                ]
            });
        }

        if (queue.tracks.data.length === 0) {
            queueString = 'The queue is empty, add some tracks with **`/play`**!';
        } else {
            queueString = queue.tracks.data
                .slice(pageIndex * 10, pageIndex * 10 + 10)
                .map((track, index) => {
                    let durationFormat =
                        track.raw.duration === 0 || track.duration === '0:00' ? '' : `\`${track.duration}\``;

                    if (track.raw.live) {
                        durationFormat = `\`${embedOptions.icons.liveTrack} LIVE\``;
                    }

                    return `**${pageIndex * 10 + index + 1}.** **${durationFormat} [${track.title}](${track.url})**`;
                })
                .join('\n');
        }

        let currentTrack = queue.currentTrack;

        const loopModesFormatted = new Map([
            [0, 'disabled'],
            [1, 'track'],
            [2, 'queue'],
            [3, 'autoplay']
        ]);

        const loopModeUserString = loopModesFormatted.get(queue.repeatMode);

        let repeatModeString = `${
            queue.repeatMode === 0
                ? ''
                : `**${
                    queue.repeatMode === 3 ? embedOptions.icons.autoplay : embedOptions.icons.loop
                } Looping**\nLoop mode is set to ${loopModeUserString}. You can change it with **\`/loop\`**.\n\n`
        }`;

        if (!currentTrack) {
            logger.debug(
                `[Shard ${interaction.guild.shardId}] User used command ${interaction.commandName} but there was no current track.`
            );

            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: `Channel: ${queue.channel.name} (${queue.channel.bitrate / 1000}kbps)`,
                            iconURL: interaction.guild.iconURL()
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
            const timestamp = queue.node.getTimestamp();
            let bar = `**\`${timestamp.current.label}\`** ${queue.node.createProgressBar({
                queue: false,
                length: playerOptions.progressBar.length ?? 12,
                timecodes: playerOptions.progressBar.timecodes ?? false,
                indicator: playerOptions.progressBar.indicator ?? '🔘',
                leftChar: playerOptions.progressBar.leftChar ?? '▬',
                rightChar: playerOptions.progressBar.rightChar ?? '▬'
            })} **\`${timestamp.total.label}\`**`;

            if (currentTrack.raw.duration === 0 || currentTrack.duration === '0:00') {
                bar = '_No duration available._';
            }

            if (currentTrack.raw.live) {
                bar = `**\`${embedOptions.icons.liveTrack} LIVE\`** - Playing continuously from live source.`;
            }

            logger.debug(
                `[Shard ${interaction.guild.shardId}] User used command ${interaction.commandName} and got queue in reply with current track.`
            );
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: `Channel: ${queue.channel.name} (${queue.channel.bitrate / 1000}kbps)`,
                            iconURL: interaction.guild.iconURL()
                        })
                        .setDescription(
                            `**${embedOptions.icons.audioPlaying} Now playing**\n` +
                                (currentTrack ? `**[${currentTrack.title}](${currentTrack.url})**` : 'None') +
                                `\nRequested by: <@${currentTrack.requestedBy.id}>` +
                                `\n ${bar}\n\n` +
                                `${repeatModeString}` +
                                `**${embedOptions.icons.queue} Tracks in queue**\n${queueString}`
                        )
                        .setThumbnail(queue.currentTrack.thumbnail)
                        .setFooter({
                            text: `Page ${pageIndex + 1} of ${totalPages} (${queueLength} tracks)`
                        })
                        .setColor(embedOptions.colors.info)
                ]
            });
        }
    }
};
