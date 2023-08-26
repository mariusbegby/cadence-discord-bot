import config from 'config';
import { EmbedOptions } from '../../types/configTypes';
const embedOptions: EmbedOptions = config.get('embedOptions');
import { notInVoiceChannel, notInSameVoiceChannel } from '../../utils/validation/voiceChannelValidator';
import { queueDoesNotExist, queueIsEmpty } from '../../utils/validation/queueValidator';
import{ SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { useQueue } from 'discord-player';
import loggerModule from '../../services/logger';

module.exports = {
    isNew: false,
    isBeta: false,
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffle tracks in the queue randomly.')
        .setDMPermission(false)
        .setNSFW(false),
    execute: async ({ interaction, executionId }) => {
        const logger = loggerModule.child({
            source: 'shuffle.js',
            module: 'slashCommand',
            name: '/shuffle',
            executionId: executionId,
            shardId: interaction.guild.shardId,
            guildId: interaction.guild.id
        });

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
        logger.debug('Shuffled queue tracks.');

        logger.debug('Responding with success embed.');
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
