const logger = require('../../services/logger');
const config = require('config');
const embedOptions = config.get('embedOptions');
const botOptions = config.get('botOptions');
const { notInVoiceChannel, notInSameVoiceChannel } = require('../../utils/validation/voiceChannelValidator');
const { queueDoesNotExist } = require('../../utils/validation/queueValidator');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    isNew: false,
    isBeta: true,
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Toggle looping a track, the whole queue or autoplay.')
        .setDMPermission(false)
        .setNSFW(false)
        .addStringOption((option) =>
            option
                .setName('mode')
                .setDescription('Mode to set for looping.')
                .setRequired(false)
                .addChoices(
                    { name: 'Track', value: '1' },
                    { name: 'Queue', value: '2' },
                    { name: 'Autoplay', value: '3' },
                    { name: 'Disabled', value: '0' }
                )
        ),
    execute: async ({ interaction }) => {
        if (await notInVoiceChannel(interaction)) {
            return;
        }

        const queue = useQueue(interaction.guild.id);

        if (await queueDoesNotExist(interaction, queue)) {
            return;
        }

        if (await notInSameVoiceChannel(interaction, queue)) {
            return;
        }

        const loopModesFormatted = new Map([
            [0, 'disabled'],
            [1, 'track'],
            [2, 'queue'],
            [3, 'autoplay']
        ]);

        const mode = parseInt(interaction.options.getString('mode'));
        const modeUserString = loopModesFormatted.get(mode);
        const currentMode = queue.repeatMode;
        const currentModeUserString = loopModesFormatted.get(currentMode);

        if (!mode && mode !== 0) {
            logger.debug(
                `[Shard ${interaction.guild.shardId}] User used command ${interaction.commandName} but no mode was provided.`
            );

            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${
                                currentMode === 3 ? embedOptions.icons.autoplay : embedOptions.icons.loop
                            } Current loop mode**\nThe looping mode is currently set to \`${currentModeUserString}\`.`
                        )
                        .setColor(embedOptions.colors.info)
                ]
            });
        }

        if (mode === currentMode) {
            logger.debug(
                `[Shard ${interaction.guild.shardId}] User used command ${interaction.commandName} but loop mode was already set to ${modeUserString}.`
            );

            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${embedOptions.icons.warning} Oops!**\nLoop mode is already \`${modeUserString}\`.`
                        )
                        .setColor(embedOptions.colors.warning)
                ]
            });
        }

        queue.setRepeatMode(mode);

        if (!queue.repeatMode === mode) {
            logger.debug(
                `[Shard ${interaction.guild.shardId}] User used command ${interaction.commandName} but failed to change loop mode.`
            );

            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${embedOptions.icons.error} Uh-oh... Failed to change loop mode!**\nI tried to change the loop mode to \`${modeUserString}\`, but something went wrong.\n\nYou can try to perform the command again.\n\n_If you think this message is incorrect or the issue persists, please submit a bug report in the **[support server](${botOptions.serverInviteUrl})**._`
                        )
                        .setColor(embedOptions.colors.error)
                ]
            });
        }

        if (queue.repeatMode === 0) {
            logger.debug(
                `[Shard ${interaction.guild.shardId}] User used command ${interaction.commandName} and disabled loop mode.`
            );

            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: interaction.member.nickname || interaction.user.username,
                            iconURL: interaction.user.avatarURL()
                        })
                        .setDescription(
                            `**${embedOptions.icons.success} Loop mode disabled**\nChanging loop mode from \`${currentModeUserString}\` to \`${modeUserString}\`.\n\nThe ${currentModeUserString} will no longer play on repeat!`
                        )
                        .setColor(embedOptions.colors.success)
                ]
            });
        }

        if (queue.repeatMode === 3) {
            logger.debug(
                `[Shard ${interaction.guild.shardId}] User used command ${interaction.commandName} and enabled autoplay.`
            );

            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: interaction.member.nickname || interaction.user.username,
                            iconURL: interaction.user.avatarURL()
                        })
                        .setDescription(
                            `**${embedOptions.icons.autoplaying} Loop mode changed**\nChanging loop mode from \`${currentModeUserString}\` to \`${modeUserString}\`.\n\nWhen the queue is empty, similar tracks will start playing!`
                        )
                        .setColor(embedOptions.colors.success)
                ]
            });
        }

        logger.debug(
            `[Shard ${interaction.guild.shardId}] User used command ${interaction.commandName} and enabled loop mode.`
        );

        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: interaction.member.nickname || interaction.user.username,
                        iconURL: interaction.user.avatarURL()
                    })
                    .setDescription(
                        `**${embedOptions.icons.looping} Loop mode changed**\nChanging loop mode from \`${currentModeUserString}\` to \`${modeUserString}\`.\n\nThe ${modeUserString} will now play on repeat!`
                    )
                    .setColor(embedOptions.colors.success)
            ]
        });
    }
};
