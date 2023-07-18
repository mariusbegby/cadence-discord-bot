const { embedOptions, botOptions } = require('../../config');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

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
                                currentMode === 3 ? embedOptions.icons.autoplay : embedOptions.icons.loop
                            } Current loop mode**\nThe looping mode is currently set to \`${currentModeUserString}\`.`
                        )
                        .setColor(embedOptions.colors.info)
                ]
            });
        }

        if (mode === currentMode) {
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
