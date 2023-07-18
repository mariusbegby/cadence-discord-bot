const path = require('node:path');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');
const { EmbedBuilder } = require('discord.js');
const { embedColors, embedIcons, botInfo } = require(path.resolve('./config.json'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Toggle looping a track, the whole queue or autoplay.')
        .setDMPermission(false)
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
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${
                                currentMode === 3 ? embedIcons.autoplay : embedIcons.loop
                            } Current loop mode**\nThe looping mode is currently set to \`${currentModeUserString}\`.`
                        )
                        .setColor(embedColors.colorInfo)
                ]
            });
        }

        if (mode === currentMode) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`**${embedIcons.warning} Oops!**\nLoop mode is already \`${modeUserString}\`.`)
                        .setColor(embedColors.colorWarning)
                ]
            });
        }

        queue.setRepeatMode(mode);

        if (!queue.repeatMode === mode) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${embedIcons.error} Uh-oh... Failed to change loop mode!**\nI tried to change the loop mode to \`${modeUserString}\`, but something went wrong.\n\nYou can try to perform the command again.\n\n_If you think this message is incorrect or the issue persists, please submit a bug report in the **[support server](${botInfo.supportServerInviteUrl})**._`
                        )
                        .setColor(embedColors.colorError)
                ]
            });
        }

        if (queue.repeatMode === 0) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: interaction.member.nickname || interaction.user.username,
                            iconURL: interaction.user.avatarURL()
                        })
                        .setDescription(
                            `**${embedIcons.success} Loop mode disabled**\nChanging loop mode from \`${currentModeUserString}\` to \`${modeUserString}\`.\n\nThe ${currentModeUserString} will no longer play on repeat!`
                        )
                        .setColor(embedColors.colorSuccess)
                ]
            });
        }

        if (queue.repeatMode === 3) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: interaction.member.nickname || interaction.user.username,
                            iconURL: interaction.user.avatarURL()
                        })
                        .setDescription(
                            `**${embedIcons.autoplaying} Loop mode changed**\nChanging loop mode from \`${currentModeUserString}\` to \`${modeUserString}\`.\n\nWhen the queue is empty, similar tracks will start playing!`
                        )
                        .setColor(embedColors.colorSuccess)
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
                        `**${embedIcons.looping} Loop mode changed**\nChanging loop mode from \`${currentModeUserString}\` to \`${modeUserString}\`.\n\nThe ${modeUserString} will now play on repeat!`
                    )
                    .setColor(embedColors.colorSuccess)
            ]
        });
    }
};
