const { SlashCommandBuilder } = require('@discordjs/builders');
const { useMainPlayer, useQueue } = require('discord-player');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Set the playback volume for tracks.')
        .addNumberOption((option) =>
            option
                .setName('percentage')
                .setDescription('Set volume percentage from 1% to 100%.')
                .setMinValue(1)
                .setMaxValue(100)
        ),
    run: async ({ interaction }) => {
        if (!interaction.member.voice.channel) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**Error**\nYou need to be in a voice channel to use this command.`
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
                        .setDescription(
                            `**Error**\nThere are no tracks playing or in the queue.`
                        )
                        .setColor('#c70057')
                ]
            });
        }

        const volume = interaction.options.getNumber('percentage');

        if (!volume) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**Volume**\nThe playback volume is currently set at \`${queue.node.volume}%\`.`
                        )
                        .setColor('#4c73df')
                ]
            });
        } else if (volume > 100 || volume < 1) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**Error**\nYou need to pick a number between \`1\` and \`100\`.`
                        )
                        .setColor('#c70057')
                ]
            });
        } else {
            queue.node.setVolume(volume);

            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: interaction.user.username,
                            iconURL: interaction.user.avatarURL()
                        })
                        .setDescription(
                            `**Volume changed**\nPlayback volume has been set to \`${volume}%\`.`
                        )
                        .setColor('#4c73df')
                ]
            });
        }
    }
};
