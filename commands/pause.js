const { SlashCommandBuilder } = require('@discordjs/builders');
const { useMainPlayer, useQueue } = require('discord-player');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause the currently playing track.'),
    run: async ({ interaction }) => {
        if (!interaction.member.voice.channel) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `You need to be in a voice channel to use this command.`
                        )
                        .setColor('#c70057')
                ]
            });
        }

        const queue = useQueue(interaction.guild.id);

        if (!queue) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`There are no tracks in the queue.`)
                        .setColor('#c70057')
                ]
            });
        }

        // change paused state to opposite of current state
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
                        .setColor('#4c73df')
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
                        .setColor('#4c73df')
                ]
            });
        }
    }
};
