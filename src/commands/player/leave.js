const { embedOptions } = require('../../config');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Clear the track queue and remove the bot from voice channel.')
        .setDMPermission(false),

    // todo, allow command to be executed if bot is only member in voice channel
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
                            `**${embedOptions.icons.warning} Oops!**\n_Hmm.._ It seems I am not in a voice channel!`
                        )
                        .setColor(embedOptions.colors.warning)
                ]
            });
        }

        if (!queue.deleted) {
            queue.delete();

            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: interaction.member.nickname || interaction.user.username,
                            iconURL: interaction.user.avatarURL()
                        })
                        .setDescription(
                            `**${embedOptions.icons.success} Leaving channel**\nCleared the track queue and left voice channel.\n\nTo play more music, use the **\`/play\`** command!`
                        )
                        .setColor(embedOptions.colors.success)
                ]
            });
        }
    }
};
