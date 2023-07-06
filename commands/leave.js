const { SlashCommandBuilder } = require('@discordjs/builders');
const { useMainPlayer, useQueue } = require('discord-player');
const { EmbedBuilder } = require('discord.js');
const { embedColors } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription(
            'Clear the track queue and remove the bot from voice channel.'
        ),

    // todo, allow command to be executed if bot is only member in voice channel
    run: async ({ interaction }) => {
        if (!interaction.member.voice.channel) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**Error**\nYou need to be in a voice channel to use this command.`
                        )
                        .setColor(embedColors.colorError)
                ]
            });
        }

        const queue = useQueue(interaction.guild.id);

        if (!queue) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**Error**\nNo tracks are currently playing, and the queue is empty. Use the \`/play\` command to play some music!`
                        )
                        .setColor(embedColors.colorError)
                ]
            });
        }

        if (!queue.deleted) {
            queue.delete();

            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**Leaving**\nCleared the track queue and left voice channel. To play more music, use the \`/play\` command!`
                        )
                        .setColor(embedColors.colorSuccess)
                ]
            });
        }
    }
};
