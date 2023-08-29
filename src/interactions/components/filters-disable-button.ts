import config from 'config';

import loggerModule from '../../services/logger';
import { EmbedOptions } from '../../types/configTypes';
import { CustomComponentInteraction } from '../../types/interactionTypes';
import { GuildQueue, useQueue } from 'discord-player';
import { EmbedBuilder, GuildMember } from 'discord.js';
import { notInSameVoiceChannel, notInVoiceChannel } from '../../utils/validation/voiceChannelValidator';
import { queueDoesNotExist } from '../../utils/validation/queueValidator';
const embedOptions: EmbedOptions = config.get('embedOptions');

const component: CustomComponentInteraction = {
    execute: async ({ interaction, executionId }) => {
        const logger = loggerModule.child({
            source: 'filters-disable-button.js',
            module: 'componentInteraction',
            name: 'filters-disable-button',
            executionId: executionId,
            shardId: interaction.guild?.shardId,
            guildId: interaction.guild?.id
        });

        logger.debug('Received disable confirmation.');

        const queue: GuildQueue = useQueue(interaction.guild!.id)!;

        const validators = [
            () => notInVoiceChannel({ interaction, executionId }),
            () => notInSameVoiceChannel({ interaction, queue, executionId }),
            () => queueDoesNotExist({ interaction, queue, executionId })
        ];

        for (const validator of validators) {
            if (await validator()) {
                return;
            }
        }

        // Reset filters before enabling provided filters
        if (queue.filters.ffmpeg.filters.length > 0) {
            queue.filters.ffmpeg.setFilters(false);
            logger.debug('Reset queue filters.');
        }

        let authorName: string;

        if (interaction.member instanceof GuildMember) {
            authorName = interaction.member.nickname || interaction.user.username;
        } else {
            authorName = interaction.user.username;
        }

        logger.debug('Responding with success embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: authorName,
                        iconURL: interaction.user.avatarURL() || ''
                    })
                    .setDescription(
                        `**${embedOptions.icons.success} Disabled filters**\nAll audio filters have been disabled.`
                    )
                    .setColor(embedOptions.colors.success)
            ],
            components: []
        });
    }
};

export default component;
