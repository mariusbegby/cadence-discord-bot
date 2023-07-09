const { SlashCommandBuilder } = require('@discordjs/builders');
const { useMainPlayer, useQueue } = require('discord-player');
const { EmbedBuilder } = require('discord.js');
const { embedColors } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause the currently playing track.'),
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

        if (!queue.currentTrack) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**Failed**\nThere are no tracks in the queue or currently playing.`
                        )
                        .setColor(embedColors.colorWarning)
                ]
            });
        }

        // change paused state to opposite of current state
        queue.node.setPaused(!queue.node.isPaused());

        if (queue.node.isPaused()) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: interaction.user.username,
                            iconURL: interaction.user.avatarURL()
                        })
                        .setDescription(
                            `**Paused**\n**[${queue.currentTrack.title}](${queue.currentTrack.url})**.`
                        )
                        .setThumbnail(queue.currentTrack.thumbnail)
                        .setColor(embedColors.colorSuccess)
                ]
            });
        } else {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: interaction.user.username,
                            iconURL: interaction.user.avatarURL()
                        })
                        .setDescription(
                            `**Resumed**\n**[${queue.currentTrack.title}](${queue.currentTrack.url})**.`
                        )
                        .setThumbnail(queue.currentTrack.thumbnail)
                        .setColor(embedColors.colorSuccess)
                ]
            });
        }
    }
};
