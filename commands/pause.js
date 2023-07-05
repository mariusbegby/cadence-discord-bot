const { SlashCommandBuilder } = require('@discordjs/builders');
const { useMainPlayer, useQueue } = require('discord-player');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause the currently playing track.'),
    run: async ({ interaction }) => {
        if (!interaction.member.voice.channel) {
            return interaction.editReply(
                'You need to be in a voice channel to use this command.'
            );
        }

        const player = useMainPlayer();
        const queue = useQueue(interaction.guild.id);

        if (!queue) {
            return await interaction.editReply(
                'There are no tracks in the queue.'
            );
        }

        queue.node.setPaused(!queue.node.isPaused());
        if (queue.node.isPaused()) {
            await interaction.editReply({
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
                ]
            });
        } else {
            await interaction.editReply({
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
                ]
            });
        }
    }
};
