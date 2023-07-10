const { SlashCommandBuilder } = require('@discordjs/builders');
const { useMainPlayer, useQueue } = require('discord-player');
const { EmbedBuilder } = require('discord.js');
const { embedColors } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Remove a track from the queue.')
        .addNumberOption((option) =>
            option
                .setName('tracknumber')
                .setDescription('Remove specified track number from queue.')
                .setMinValue(1)
                .setRequired(true)
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
                            `**Failed**\nThere are no tracks in the queue. Add tracks with \`/play\`!`
                        )
                        .setColor(embedColors.colorWarning)
                ]
            });
        }

        const removeTrackNumber = interaction.options.getNumber('tracknumber');

        if (removeTrackNumber > queue.tracks.data.length) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**Error**\nThere are \`${queue.tracks.data.length}\` tracks in the queue. You cannot remove track number \`${removeTrackNumber}\`.`
                        )
                        .setColor(embedColors.colorError)
                ]
            });
        }

        // Remove specified track number from queue
        const removedTrack = queue.node.remove(removeTrackNumber - 1);

        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: interaction.user.username,
                        iconURL: interaction.user.avatarURL()
                    })
                    .setDescription(
                        `**Removed**\n**[${removedTrack.title}](${removedTrack.url})**.`
                    )
                    .setThumbnail(removedTrack.thumbnail)
                    .setColor(embedColors.colorSuccess)
            ]
        });
    }
};
