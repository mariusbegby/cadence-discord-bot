const { embedOptions } = require('../../config');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause or resume the current track.')
        .setDMPermission(false),
    execute: async ({ interaction }) => {
        if (!interaction.member.voice.channel) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${embedOptions.icons.warning} Oops!**\nYou need to be in a voice channel to use this command.`
                        )
                        .setColor(embedOptions.colors.warning)
                ]
            });
        }

        const queue = useQueue(interaction.guild.id);

        if (!queue) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${embedOptions.icons.warning} Oops!**\nThere are no tracks in the queue and nothing currently playing. First add some tracks with **\`/play\`**!`
                        )
                        .setColor(embedOptions.colors.warning)
                ]
            });
        }

        if (!queue.currentTrack) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${embedOptions.icons.warning} Oops!**\nThere is nothing currently playing. First add some tracks with **\`/play\`**!`
                        )
                        .setColor(embedOptions.colors.warning)
                ]
            });
        }

        let durationFormat =
            queue.currentTrack.raw.duration === 0 || queue.currentTrack.duration === '0:00'
                ? ''
                : `\`${queue.currentTrack.duration}\``;

        // change paused state to opposite of current state
        queue.node.setPaused(!queue.node.isPaused());

        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: interaction.member.nickname || interaction.user.username,
                        iconURL: interaction.user.avatarURL()
                    })
                    .setDescription(
                        `**${embedOptions.icons.pauseResumed} ${
                            queue.node.isPaused() ? 'Paused Track' : 'Resumed track'
                        }**\n**${durationFormat} [${queue.currentTrack.title}](${queue.currentTrack.url})**`
                    )
                    .setThumbnail(queue.currentTrack.thumbnail)
                    .setColor(embedOptions.colors.success)
            ]
        });
    }
};
