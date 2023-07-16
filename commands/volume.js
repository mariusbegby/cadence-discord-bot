const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');
const { EmbedBuilder } = require('discord.js');
const { embedColors, embedIcons } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Show or set the playback volume for tracks.')
        .setDMPermission(false)
        .addNumberOption((option) =>
            option
                .setName('percentage')
                .setDescription('Set volume percentage from 1% to 100%.')
                .setMinValue(0)
                .setMaxValue(100)
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
                            `**${embedIcons.warning} Oops!**\nThere are no tracks in the queue and nothing currently playing. First add some tracks with **\`/play\`**!`
                        )
                        .setColor(embedColors.colorWarning)
                ]
            });
        }

        const volume = interaction.options.getNumber('percentage');

        if (!volume && volume !== 0) {
            const currentVolume = queue.node.volume;

            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${
                                currentVolume === 0
                                    ? embedIcons.volumeIsMuted
                                    : embedIcons.volume
                            } Playback volume**\nThe playback volume is currently set to \`${currentVolume}%\`.`
                        )
                        .setColor(embedColors.colorInfo)
                ]
            });
        } else if (volume > 100 || volume < 0) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${embedIcons.warning} Oops!**\nYou cannot set the volume to \`${volume}\`, please pick a value betwen \`1\`% and \`100\`%.`
                        )
                        .setColor(embedColors.colorWarning)
                ]
            });
        } else {
            queue.node.setVolume(volume);

            if (volume === 0) {
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({
                                name:
                                    interaction.member.nickname ||
                                    interaction.user.username,
                                iconURL: interaction.user.avatarURL()
                            })
                            .setDescription(
                                `**${embedIcons.volumeMuted} Audio muted**\nPlayback audio has been muted, because volume was set to \`${volume}%\`.`
                            )
                            .setColor(embedColors.colorSuccess)
                    ]
                });
            }

            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name:
                                interaction.member.nickname ||
                                interaction.user.username,
                            iconURL: interaction.user.avatarURL()
                        })
                        .setDescription(
                            `**${embedIcons.volumeChanged} Volume changed**\nPlayback volume has been changed to \`${volume}%\`.`
                        )
                        .setColor(embedColors.colorSuccess)
                ]
            });
        }
    }
};
