import config from 'config';

import loggerModule from '../../services/logger';
import { EmbedOptions, FFmpegFilterOptions } from '../../types/configTypes';
import { CustomComponentInteraction } from '../../types/interactionTypes';
import { GuildQueue, QueueFilters, useQueue } from 'discord-player';
import { EmbedBuilder, GuildMember, StringSelectMenuInteraction } from 'discord.js';
import { notInSameVoiceChannel, notInVoiceChannel } from '../../utils/validation/voiceChannelValidator';
import { queueDoesNotExist } from '../../utils/validation/queueValidator';
const embedOptions: EmbedOptions = config.get('embedOptions');
const ffmpegFilterOptions: FFmpegFilterOptions = config.get('ffmpegFilterOptions');

const component: CustomComponentInteraction = {
    execute: async ({ interaction, executionId }) => {
        const logger = loggerModule.child({
            source: 'filters-select-menu.js',
            module: 'componentInteraction',
            name: 'filters-select-menu',
            executionId: executionId,
            shardId: interaction.guild?.shardId,
            guildId: interaction.guild?.id
        });

        logger.debug('Received select menu confirmation.');

        const selectMenuInteraction = interaction as StringSelectMenuInteraction;
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

        queue.filters.ffmpeg.setInputArgs([
            '-threads',
            ffmpegFilterOptions.threadAmount,
            '-reconnect',
            '1',
            '-reconnect_streamed',
            '1',
            '-reconnect_delay_max',
            '10',
            '-vn'
        ]);

        // Reset filters before enabling provided filters
        if (queue.filters.ffmpeg.filters.length > 0) {
            queue.filters.ffmpeg.setFilters(false);
            logger.debug('Reset queue filters.');
        }

        // if bassboost is enabled and not normalizer, also enable normalizer to avoid distrorion
        if (
            (selectMenuInteraction.values.includes('bassboost_low') ||
                selectMenuInteraction.values.includes('bassboost')) &&
            !selectMenuInteraction.values.includes('normalizer')
        ) {
            selectMenuInteraction.values.push('normalizer');
        }

        // Enable provided filters
        queue.filters.ffmpeg.toggle(selectMenuInteraction.values as (keyof QueueFilters)[]);
        logger.debug(`Enabled filters ${selectMenuInteraction.values.join(', ')}.`);

        let authorName: string;

        if (selectMenuInteraction.member instanceof GuildMember) {
            authorName = selectMenuInteraction.member.nickname || selectMenuInteraction.user.username;
        } else {
            authorName = selectMenuInteraction.user.username;
        }

        logger.debug('Responding with success embed.');
        return await selectMenuInteraction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: authorName,
                        iconURL: selectMenuInteraction.user.avatarURL() || ''
                    })
                    .setDescription(
                        `**${
                            embedOptions.icons.success
                        } Filters toggled**\nNow using these filters:\n${selectMenuInteraction.values
                            .map((enabledFilter: string) => {
                                const filter = ffmpegFilterOptions.availableFilters.find(
                                    (filter) => enabledFilter == filter.value
                                );

                                if (!filter) {
                                    return enabledFilter;
                                }

                                return `- **${filter.emoji} ${filter.label}**`;
                            })
                            .join('\n')}`
                    )
                    .setColor(embedOptions.colors.success)
            ],
            components: []
        });
    }
};

export default component;
