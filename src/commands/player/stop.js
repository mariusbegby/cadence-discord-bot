const logger = require('../../services/logger');
const { embedOptions } = require('../../config');
const { notInVoiceChannel } = require('../../utils/validation/voiceChannelValidator');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop playing audio and clear the track queue.')
        .setDMPermission(false),

    // todo, allow command to be executed if bot is only member in voice channel
    execute: async ({ interaction }) => {
        if (await notInVoiceChannel(interaction)) {
            return;
        }

        const queue = useQueue(interaction.guild.id);

        if (!queue) {
            logger.debug(
                `[Shard ${interaction.guild.shardId}] User used command ${interaction.commandName} but there was no queue.`
            );
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
            queue.clear();
            queue.node.stop();
            logger.debug(
                `[Shard ${interaction.guild.shardId}] User used command ${interaction.commandName} and cleared the queue.`
            );
        }

        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: interaction.member.nickname || interaction.user.username,
                        iconURL: interaction.user.avatarURL()
                    })
                    .setDescription(
                        `**${embedOptions.icons.success} Stopped playing**\nStopped playing audio and cleared the track queue.\n\nTo play more music, use the **\`/play\`** command!`
                    )
                    .setColor(embedOptions.colors.success)
            ]
        });
    }
};
