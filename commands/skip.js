const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');
const { EmbedBuilder } = require('discord.js');
const { embedColors, embedIcons } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip current or specified track.')
        .setDMPermission(false)
        .addNumberOption((option) =>
            option
                .setName('tracknumber')
                .setDescription('Track number to skip to in the queue.')
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

        const queue = useQueue(interaction.guild.id);

        if (!queue) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${embedIcons.warning} Oops!**\nThere are no tracks in the queue and nothing currently playing. First add some tracks with \`/play\`!`
                        )
                        .setColor(embedColors.colorWarning)
                ]
            });
        }

        const skipToTrack = interaction.options.getNumber('tracknumber');

        if (skipToTrack) {
            if (skipToTrack > queue.tracks.data.length) {
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(
                                `**${embedIcons.warning} Oops!**\nThere are only \`${queue.tracks.data.length}\` tracks in the queue. You cannot skip to track \`${skipToTrack}\`.\n\nView tracks added to the queue with \`/queue\`.`
                            )
                            .setColor(embedColors.colorWarning)
                    ]
                });
            } else {
                const skippedTrack = queue.currentTrack;
                let durationFormat =
                    skippedTrack.raw.duration === 0 ||
                    skippedTrack.duration === '0:00'
                        ? ''
                        : `\`${skippedTrack.duration}\``;
                queue.node.skipTo(skipToTrack - 1);

                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({
                                name: interaction.member.nickname || interaction.user.username,
                                iconURL: interaction.user.avatarURL()
                            })
                            .setDescription(
                                `**${embedIcons.skipped} Skipped track**\n${durationFormat} **[${skippedTrack.title}](${skippedTrack.url})**`
                            )
                            .setThumbnail(skippedTrack.thumbnail)
                            .setColor(embedColors.colorSuccess)
                    ]
                });
            }
        } else {
            if (queue.tracks.data.length === 0 && !queue.currentTrack) {
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(
                                `**${embedIcons.warning} Oops!**\nThere is nothing currently playing. First add some tracks with \`/play\`!`
                            )
                            .setColor(embedColors.colorWarning)
                    ]
                });
            }

            const skippedTrack = queue.currentTrack;
            let durationFormat =
                skippedTrack.raw.duration === 0 ||
                skippedTrack.duration === '0:00'
                    ? ''
                    : `\`${skippedTrack.duration}\``;
            queue.node.skip();

            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: interaction.member.nickname || interaction.user.username,
                            iconURL: interaction.user.avatarURL()
                        })
                        .setDescription(
                            `**${embedIcons.skipped} Skipped track**\n${durationFormat} **[${skippedTrack.title}](${skippedTrack.url})**`
                        )
                        .setThumbnail(skippedTrack.thumbnail)
                        .setColor(embedColors.colorSuccess)
                ]
            });
        }
    }
};
