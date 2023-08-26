const logger = require('../../services/logger');
const config = require('config');
const embedOptions = config.get('embedOptions');
const { notInVoiceChannel, notInSameVoiceChannel } = require('../../utils/validation/voiceChannelValidator');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    isNew: false,
    isBeta: false,
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop playing audio and clear the track queue.')
        .setDMPermission(false)
        .setNSFW(false),
    execute: async ({ interaction, executionId }) => {
        if (await notInVoiceChannel({ interaction, executionId })) {
            return;
        }

        const queue = useQueue(interaction.guild.id);

        if (!queue) {
            logger.debug(
                `User used command ${interaction.commandName} but there was no queue.`
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

        if (await notInSameVoiceChannel({ interaction, queue, executionId })) {
            return;
        }

        if (!queue.deleted) {
            queue.setRepeatMode(0);
            queue.clear();
            queue.node.stop();
            logger.debug(
                `User used command ${interaction.commandName} and cleared the queue.`
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
