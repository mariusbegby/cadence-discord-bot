import config from 'config';
import { EmbedOptions } from '../../types/configTypes';
const embedOptions: EmbedOptions = config.get('embedOptions');
const ffmpegFilterOptions = config.get('ffmpegFilterOptions');
import { notInVoiceChannel, notInSameVoiceChannel } from '../../utils/validation/voiceChannelValidator';
import { queueDoesNotExist, queueNoCurrentTrack } from '../../utils/validation/queueValidator';
import {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ButtonBuilder
} from 'discord.js';
import { useQueue } from 'discord-player';
import loggerModule from '../../services/logger';

module.exports = {
    isNew: false,
    isBeta: false,
    data: new SlashCommandBuilder()
        .setName('filters')
        .setDescription('Toggle various audio filters during playback.')
        .setDMPermission(false)
        .setNSFW(false),
    execute: async ({ interaction, executionId }) => {
        const logger = loggerModule.child({
            source: 'filters.js',
            module: 'slashCommand',
            name: '/filters',
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

        if (await queueNoCurrentTrack({ interaction, queue, executionId })) {
            return;
        }

        const filterOptions = [];

        ffmpegFilterOptions.availableFilters.forEach((filter) => {
            let isEnabled = false;

            if (queue.filters.ffmpeg.filters.includes(filter.value)) {
                isEnabled = true;
            }

            filterOptions.push(
                new StringSelectMenuOptionBuilder()
                    .setLabel(filter.label)
                    .setDescription(filter.description)
                    .setValue(filter.value)
                    .setEmoji(filter.emoji)
                    .setDefault(isEnabled)
            );
        });

        const filterSelect = new StringSelectMenuBuilder()
            .setCustomId('filters')
            .setPlaceholder('Select multiple options.')
            .setMinValues(0)
            .setMaxValues(filterOptions.length)
            .addOptions(filterOptions);

        const filterActionRow = new ActionRowBuilder().addComponents(filterSelect);

        const disableFiltersActionRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('disable-filters')
                .setLabel('Disable all filters')
                .setStyle('Secondary')
                .setEmoji(embedOptions.icons.disable)
        );

        logger.debug('Sending info embed with action row components.');
        const response = await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**Toggle filters** ${embedOptions.icons.beta}\nEnable or disable audio filters for playback from the menu.`
                    )
                    .setColor(embedOptions.colors.info)
            ],
            components: [filterActionRow, disableFiltersActionRow]
        });

        const collectorFilter = (i) => i.user.id === interaction.user.id;
        try {
            const confirmation = await response.awaitMessageComponent({
                filter: collectorFilter,
                time: 300_000
            });

            confirmation.deferUpdate();

            logger.debug('Received component interaction response.');

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

            if (confirmation.customId === 'disable-filters' || confirmation.values.length === 0) {
                logger.debug('Responding with success embed.');
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({
                                name: interaction.member.nickname || interaction.user.username,
                                iconURL: interaction.user.avatarURL()
                            })
                            .setDescription(
                                `**${embedOptions.icons.success} Disabled filters**\nAll audio filters have been disabled.`
                            )
                            .setColor(embedOptions.colors.success)
                    ],
                    components: []
                });
            }

            // if bassboost is enabled and not normalizer, also enable normalizer to avoid distrorion
            if (
                (confirmation.values.includes('bassboost_low') || confirmation.values.includes('bassboost')) &&
                !confirmation.values.includes('normalizer')
            ) {
                confirmation.values.push('normalizer');
            }

            // Enable provided filters
            queue.filters.ffmpeg.toggle(confirmation.values);
            logger.debug(`Enabled filters ${confirmation.values.join(', ')}.`);

            logger.debug('Responding with success embed.');
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: interaction.member.nickname || interaction.user.username,
                            iconURL: interaction.user.avatarURL()
                        })
                        .setDescription(
                            `**${
                                embedOptions.icons.success
                            } Filters toggled**\nNow using these filters:\n${confirmation.values
                                .map((enabledFilter) => {
                                    const filter = ffmpegFilterOptions.availableFilters.find(
                                        (filter) => enabledFilter == filter.value
                                    );

                                    return `- **${filter.emoji} ${filter.label}**`;
                                })
                                .join('\n')}`
                        )
                        .setColor(embedOptions.colors.success)
                ],
                components: []
            });
        } catch (error) {
            if (error.code === 'InteractionCollectorError') {
                logger.debug('Interaction response timed out.');
                return;
            }

            logger.error(error, 'Unhandled error while awaiting or handling component interaction.');
            return;
        }
    }
};
