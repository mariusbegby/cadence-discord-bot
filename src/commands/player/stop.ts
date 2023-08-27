import config from 'config';
import { EmbedOptions } from '../../types/configTypes';
const embedOptions: EmbedOptions = config.get('embedOptions');
import { notInVoiceChannel, notInSameVoiceChannel } from '../../utils/validation/voiceChannelValidator';
import{ SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { useQueue } from 'discord-player';
import loggerModule from '../../services/logger';
import { CommandParams } from '../../types/commandTypes';

module.exports = {
    isNew: false,
    isBeta: false,
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop playing audio and clear the track queue.')
        .setDMPermission(false)
        .setNSFW(false),
    execute: async ({ interaction, executionId }: CommandParams) => {
        const logger = loggerModule.child({
            source: 'stop.js',
            module: 'slashCommand',
            name: '/stop',
            executionId: executionId,
            shardId: interaction.guild.shardId,
            guildId: interaction.guild.id
        });

        if (await notInVoiceChannel({ interaction, executionId })) {
            return;
        }

        const queue = useQueue(interaction.guild.id);

        if (!queue) {
            logger.debug('There is no queue.');

            logger.debug('Responding with warning embed.');
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
            logger.debug('Cleared and stopped the queue.');
        }

        logger.debug('Responding with success embed.');
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
