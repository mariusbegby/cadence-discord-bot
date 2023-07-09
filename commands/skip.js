const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');
const { EmbedBuilder } = require('discord.js');
const { embedColors } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the currently playing track.')
        .addNumberOption((option) =>
            option
                .setName('tracknumber')
                .setDescription(
                    'Skip to next track or the given track number in the queue.'
                )
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

        if (!queue) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**Failed**\nThere are no tracks in the queue.`
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
                                `**Error**\nThere are \`${queue.tracks.data.length}\` tracks in the queue. You cannot skip to track number \`${skipToTrack}\`.`
                            )
                            .setColor(embedColors.colorError)
                    ]
                });
            } else {
                const skippedTrack = queue.currentTrack;
                queue.node.skipTo(skipToTrack - 1);

                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({
                                name: interaction.user.username,
                                iconURL: interaction.user.avatarURL()
                            })
                            .setDescription(
                                `**Skipped**\n**[${skippedTrack.title}](${skippedTrack.url})**.`
                            )
                            .setThumbnail(skippedTrack.thumbnail)
                            .setColor(embedColors.colorSuccess)
                    ]
                });
            }
        } else {
            const skippedTrack = queue.currentTrack;
            queue.node.skip();

            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: interaction.user.username,
                            iconURL: interaction.user.avatarURL()
                        })
                        .setDescription(
                            `**Skipped**\n**[${skippedTrack.title}](${skippedTrack.url})**.`
                        )
                        .setThumbnail(skippedTrack.thumbnail)
                        .setColor(embedColors.colorSuccess)
                ]
            });
        }
    }
};
