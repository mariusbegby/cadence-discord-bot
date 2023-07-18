const { embedOptions } = require('../../config');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

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

        const volume = interaction.options.getNumber('percentage');

        if (!volume && volume !== 0) {
            const currentVolume = queue.node.volume;

            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${
                                currentVolume === 0 ? embedOptions.icons.volumeIsMuted : embedOptions.icons.volume
                            } Playback volume**\nThe playback volume is currently set to \`${currentVolume}%\`.`
                        )
                        .setColor(embedOptions.colors.info)
                ]
            });
        } else if (volume > 100 || volume < 0) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${embedOptions.icons.warning} Oops!**\nYou cannot set the volume to \`${volume}\`, please pick a value betwen \`1\`% and \`100\`%.`
                        )
                        .setColor(embedOptions.colors.warning)
                ]
            });
        } else {
            queue.node.setVolume(volume);

            if (volume === 0) {
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({
                                name: interaction.member.nickname || interaction.user.username,
                                iconURL: interaction.user.avatarURL()
                            })
                            .setDescription(
                                `**${embedOptions.icons.volumeMuted} Audio muted**\nPlayback audio has been muted, because volume was set to \`${volume}%\`.`
                            )
                            .setColor(embedOptions.colors.success)
                    ]
                });
            }

            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: interaction.member.nickname || interaction.user.username,
                            iconURL: interaction.user.avatarURL()
                        })
                        .setDescription(
                            `**${embedOptions.icons.volumeChanged} Volume changed**\nPlayback volume has been changed to \`${volume}%\`.`
                        )
                        .setColor(embedOptions.colors.success)
                ]
            });
        }
    }
};
