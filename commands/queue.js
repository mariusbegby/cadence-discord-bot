const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');
const { EmbedBuilder } = require('discord.js');
const { embedColors, progressBarOptions } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Show the list of tracks added to the queue.')
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
                            `**Failed**\nYou need to be in a voice channel to use this command.`
                        )
                        .setColor(embedColors.colorWarning)
                ]
            });
        }

        const queue = useQueue(interaction.guild.id);
        let queueString = '';

        if (!queue) {
            queueString = `There are no tracks in the queue. Add tracks with \`/play\`!`;
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: interaction.guild.name,
                            iconURL: interaction.guild.iconURL()
                        })
                        .setDescription(`**Queue**\n${queueString}`)
                        .setColor(embedColors.colorInfo)
                        .setFooter({
                            text: `Page 1 of 1`
                        })
                ]
            });
        }

        const totalPages = Math.ceil(queue.tracks.data.length / 10) || 1;
        const page = (interaction.options.getNumber('page') || 1) - 1;

        if (page > totalPages - 1) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**Error**\nInvalid page number. There are only a total of \`${totalPages}\` pages of tracks.`
                        )
                        .setColor(embedColors.colorError)
                ]
            });
        }

        if (queue.tracks.data.length === 0) {
            queueString = 'There are no tracks in the queue.';
        } else {
            queueString = queue.tracks.data
                .slice(page * 10, page * 10 + 10)
                .map((track, index) => {
                    let durationFormat =
                        track.raw.duration === 0 || track.duration === '0:00'
                            ? ''
                            : `\`${track.duration}\``;

                    return `**${page * 10 + index + 1}.** ${durationFormat} [${
                        track.title
                    }](${track.url})`;
                })
                .join('\n');
        }

        let currentTrack = queue.currentTrack;

        if (!currentTrack) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: interaction.guild.name,
                            iconURL: interaction.guild.iconURL()
                        })
                        .setDescription(`**Queue**\n${queueString}`)
                        .setFooter({
                            text: `Page ${page + 1} of ${totalPages}`
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
                bar = 'No duration available.';
            }

            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: interaction.guild.name,
                            iconURL: interaction.guild.iconURL()
                        })
                        .setDescription(
                            `**Currently playing**\n` +
                                (currentTrack
                                    ? `**[${currentTrack.title}](${currentTrack.url})**`
                                    : 'None') +
                                `\nRequested by: <@${currentTrack.requestedBy.id}>` +
                                `\n ${bar}` +
                                `\n\n**Queue**\n${queueString}`
                        )
                        .setThumbnail(queue.currentTrack.thumbnail)
                        .setFooter({
                            text: `Page ${page + 1} of ${totalPages}`
                        })
                        .setColor(embedColors.colorInfo)
                ]
            });
        }
    }
};
