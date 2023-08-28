import config from 'config';

import loggerModule from '../../services/logger';
import { EmbedOptions, FFmpegFilterOptions } from '../../types/configTypes';
import { CustomComponentInteraction } from '../../types/interactionTypes';
import { QueueFilters, useQueue } from 'discord-player';
import { EmbedBuilder, GuildMember, StringSelectMenuInteraction } from 'discord.js';
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

        logger.info('Received select menu confirmation.');

        const queue = useQueue(interaction.guild!.id)!;

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

        if (!(interaction instanceof StringSelectMenuInteraction)) {
            return;
        }

        // if bassboost is enabled and not normalizer, also enable normalizer to avoid distrorion
        if (
            (interaction.values.includes('bassboost_low') || interaction.values.includes('bassboost')) &&
            !interaction.values.includes('normalizer')
        ) {
            interaction.values.push('normalizer');
        }

        // Enable provided filters
        queue.filters.ffmpeg.toggle(interaction.values as (keyof QueueFilters)[]);
        logger.debug(`Enabled filters ${interaction.values.join(', ')}.`);

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
                        `**${
                            embedOptions.icons.success
                        } Filters toggled**\nNow using these filters:\n${interaction.values
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
