const logger = require('../../services/logger');
const { embedOptions } = require('../../config');
const { notInVoiceChannel } = require('../../utils/validation/voiceChannelValidator');
const { queueDoesNotExist } = require('../../utils/validation/queueValidator');
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
        if (await notInVoiceChannel(interaction)) {
            return;
        }

        const queue = useQueue(interaction.guild.id);

        if (await queueDoesNotExist(interaction, queue)) {
            return;
        }

        const volume = interaction.options.getNumber('percentage');

        if (!volume && volume !== 0) {
            const currentVolume = queue.node.volume;

            logger.debug(
                `[Shard ${interaction.guild.shardId}] User used command ${interaction.commandName} but no volume was provided, providing info of current volume.`
            );
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
            logger.debug(
                `[Shard ${interaction.guild.shardId}] User used command ${interaction.commandName} but volume was higher than 100% or lower than 0%.`
            );
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
                logger.debug(
                    `[Shard ${interaction.guild.shardId}] User used command ${interaction.commandName} and muted volume.`
                );
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

            logger.debug(
                `[Shard ${interaction.guild.shardId}] User used command ${interaction.commandName} and changed volume.`
            );
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
