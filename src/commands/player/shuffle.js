const logger = require('../../services/logger');
const config = require('config');
const embedOptions = config.get('embedOptions');
const { notInVoiceChannel, notInSameVoiceChannel } = require('../../utils/validation/voiceChannelValidator');
const { queueDoesNotExist, queueIsEmpty } = require('../../utils/validation/queueValidator');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    isNew: false,
    isBeta: false,
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffle tracks in the queue randomly.')
        .setDMPermission(false)
        .setNSFW(false),
    execute: async ({ interaction, executionId }) => {
        if (await notInVoiceChannel({ interaction, executionId })) {
            return;
        }

        const queue = useQueue(interaction.guild.id);

        if (await queueDoesNotExist({ interaction, queue, executionId })) {
            return;
        }

        if (await notInSameVoiceChannel({ interaction, queue, executionId })) {
            return;
        }

        if (await queueIsEmpty({ interaction, queue, executionId })) {
            return;
        }

        queue.tracks.shuffle();

        logger.debug(
            `User used command ${interaction.commandName} and shuffled the queue.`
        );

        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: interaction.member.nickname || interaction.user.username,
                        iconURL: interaction.user.avatarURL()
                    })
                    .setDescription(
                        `**${embedOptions.icons.shuffled} Shuffled queue tracks**\nThe **${queue.tracks.data.length}** tracks in the queue has been shuffled.\n\nView the new queue order with **\`/queue\`**.`
                    )
                    .setColor(embedOptions.colors.success)
            ]
        });
    }
};
