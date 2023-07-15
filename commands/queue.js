const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');
const { EmbedBuilder } = require('discord.js');
const {
    embedColors,
    embedIcons,
    progressBarOptions
} = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Show the list of tracks added to the queue.')
        .setDMPermission(false)
        .addNumberOption((option) =>
            option
                .setName('page')
                .setDescription('Page number of the queue')
                .setMinValue(1)
        ),
    run: async ({ interaction }) => {
        if (!interaction.member.voice.channel) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${embedIcons.warning} Oops!**\nYou need to be in a voice channel to use this command.`
                        )
                        .setColor(embedColors.colorWarning)
                ]
            });
        }

        const pageIndex = (interaction.options.getNumber('page') || 1) - 1;
        const queue = useQueue(interaction.guild.id);
        let queueString = '';

        if (!queue) {
            if (pageIndex >= 1) {
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(
                                `**${embedIcons.warning} Oops!**\nPage \`${pageIndex + 1}\` is not a valid page number.\n\nThe queue is currently empty, first add some tracks with \`/play\`!`
                            )
                            .setColor(embedColors.colorWarning)
                    ]
                });
            }

            queueString = 'The queue is empty, add some tracks with `/play`!';
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: interaction.guild.name,
                            iconURL: interaction.guild.iconURL()
                        })
                        .setDescription(
                            `**${embedIcons.queue} Tracks in queue**\n${queueString}`
                        )
                        .setColor(embedColors.colorInfo)
                        .setFooter({
                            text: 'Page 1 of 1'
                        })
                ]
            });
        }

        const totalPages = Math.ceil(queue.tracks.data.length / 10) || 1;

        if (pageIndex > totalPages - 1) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${embedIcons.warning} Oops!**\nPage \`${pageIndex + 1}\` is not a valid page number.\n\nThere are only a total of \`${totalPages}\` pages in the queue.`
                        )
                        .setColor(embedColors.colorWarning)
                ]
            });
        }

        if (queue.tracks.data.length === 0) {
            queueString = 'The queue is empty, add some tracks with `/play`!';
        } else {
            queueString = queue.tracks.data
                .slice(pageIndex * 10, pageIndex * 10 + 10)
                .map((track, index) => {
                    let durationFormat =
                        track.raw.duration === 0 || track.duration === '0:00'
                            ? ''
                            : `\`${track.duration}\``;

                    return `**${pageIndex * 10 + index + 1}.** ${durationFormat} **[${
                        track.title
                    }](${track.url})**`;
                })
                .join('\n');
        }

        let currentTrack = queue.currentTrack;

        if (!currentTrack) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: `Channel: ${queue.channel.name} (${
                                queue.channel.bitrate / 1000
                            }kbps)`,
                            iconURL: interaction.guild.iconURL()
                        })
                        .setDescription(
                            `**${embedIcons.queue} Tracks in queue**\n${queueString}`
                        )
                        .setFooter({
                            text: `Page ${pageIndex + 1} of ${totalPages}`
                        })
                        .setColor(embedColors.colorInfo)
                ]
            });
        } else {
            const timestamp = queue.node.getTimestamp();
            let bar = `\`${
                timestamp.current.label
            }\` ${queue.node.createProgressBar({
                queue: false,
                length: progressBarOptions.length ?? 12,
                timecodes: progressBarOptions.timecodes ?? false,
                indicator: progressBarOptions.indicator ?? '🔘',
                leftChar: progressBarOptions.leftChar ?? '▬',
                rightChar: progressBarOptions.rightChar ?? '▬'
            })} \`${timestamp.total.label}\``;

            if (
                currentTrack.raw.duration === 0 ||
                currentTrack.duration === '0:00'
            ) {
                bar = '_No duration available._';
            }

            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: `Channel: ${queue.channel.name} (${
                                queue.channel.bitrate / 1000
                            }kbps)`,
                            iconURL: interaction.guild.iconURL()
                        })
                        .setDescription(
                            `**${embedIcons.audioPlaying} Now playing**\n` +
                                (currentTrack
                                    ? `**[${currentTrack.title}](${currentTrack.url})**`
                                    : 'None') +
                                `\nRequested by: <@${currentTrack.requestedBy.id}>` +
                                `\n ${bar}` +
                                `\n\n**${embedIcons.queue} Tracks in queue**\n${queueString}`
                        )
                        .setThumbnail(queue.currentTrack.thumbnail)
                        .setFooter({
                            text: `Page ${pageIndex + 1} of ${totalPages}`
                        })
                        .setColor(embedColors.colorInfo)
                ]
            });
        }
    }
};
