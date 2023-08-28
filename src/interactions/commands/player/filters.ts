import config from 'config';
import { NodeResolvable, QueueFilters, useQueue } from 'discord-player';
import {
    APIActionRowComponent,
    APIMessageActionRowComponent,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    EmbedBuilder,
    GuildMember,
    Interaction,
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder
} from 'discord.js';

import loggerModule from '../../../services/logger';
import { CustomError, CustomSlashCommandInteraction } from '../../../types/interactionTypes';
import { EmbedOptions, FFmpegFilterOption, FFmpegFilterOptions } from '../../../types/configTypes';
import { queueDoesNotExist, queueNoCurrentTrack } from '../../../utils/validation/queueValidator';
import { notInSameVoiceChannel, notInVoiceChannel } from '../../../utils/validation/voiceChannelValidator';

const embedOptions: EmbedOptions = config.get('embedOptions');
const ffmpegFilterOptions: FFmpegFilterOptions = config.get('ffmpegFilterOptions');

const command: CustomSlashCommandInteraction = {
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
            shardId: interaction.guild?.shardId,
            guildId: interaction.guild?.id
        });

        if (await notInVoiceChannel({ interaction, executionId })) {
            return;
        }

        const queue: NodeResolvable = useQueue(interaction.guild!.id)!;

        if (await queueDoesNotExist({ interaction, queue, executionId })) {
            return;
        }

        if (await notInSameVoiceChannel({ interaction, queue, executionId })) {
            return;
        }

        if (await queueNoCurrentTrack({ interaction, queue, executionId })) {
            return;
        }

        const filterOptions: StringSelectMenuOptionBuilder[] = [];

        ffmpegFilterOptions.availableFilters.forEach((filter: FFmpegFilterOption) => {
            let isEnabled = false;

            if (queue.filters.ffmpeg.filters.includes(filter.value as keyof QueueFilters)) {
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
            .addOptions(filterOptions)
            .toJSON();

        const filterActionRow: APIActionRowComponent<APIMessageActionRowComponent> = {
            type: ComponentType.ActionRow,
            components: [filterSelect]
        };

        const disableButton = new ButtonBuilder()
            .setCustomId('disable-filters')
            .setLabel('Disable all filters')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(embedOptions.icons.disable)
            .toJSON();

        const disableFiltersActionRow: APIActionRowComponent<APIMessageActionRowComponent> = {
            type: ComponentType.ActionRow,
            components: [disableButton]
        };

        logger.debug('Sending info embed with action row components.');
        const response = await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription('**Toggle filters**\nEnable or disable audio filters for playback from the menu.')
                    .setColor(embedOptions.colors.info)
            ],
            components: [filterActionRow, disableFiltersActionRow]
        });

        const collectorFilter = (i: Interaction) => i.user.id === interaction.user.id;
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

            let authorName: string;

            if (interaction.member instanceof GuildMember) {
                authorName = interaction.member.nickname || interaction.user.username;
            } else {
                authorName = interaction.user.username;
            }

            if ('values' in confirmation) {
                // if bassboost is enabled and not normalizer, also enable normalizer to avoid distrorion
                if (
                    (confirmation.values.includes('bassboost_low') || confirmation.values.includes('bassboost')) &&
                    !confirmation.values.includes('normalizer')
                ) {
                    confirmation.values.push('normalizer');
                }

                // Enable provided filters
                queue.filters.ffmpeg.toggle(confirmation.values as (keyof QueueFilters)[]);
                logger.debug(`Enabled filters ${confirmation.values.join(', ')}.`);

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
                                } Filters toggled**\nNow using these filters:\n${confirmation.values
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
            } else if (confirmation.customId === 'disable-filters') {
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
            } else {
                logger.warn('Unhandled component interaction response.');
            }
        } catch (error) {
            if (error instanceof CustomError) {
                if (error.code === 'InteractionCollectorError') {
                    logger.debug('Interaction response timed out.');
                    return;
                }

                if (error.message === 'Collector received no interactions before ending with reason: time') {
                    logger.debug('Interaction response timed out.');
                    return;
                }

                logger.error(error, 'Unhandled error while awaiting or handling component interaction.');
                return;
            } else {
                if (
                    error instanceof Error &&
                    error.message === 'Collector received no interactions before ending with reason: time'
                ) {
                    logger.debug('Interaction response timed out.');
                    return;
                }
                throw error;
            }
        }
    }
};

export default command;
