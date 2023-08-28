import config from 'config';
import { NodeResolvable, QueueFilters, useQueue } from 'discord-player';
import {
    APIActionRowComponent,
    APIMessageActionRowComponent,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    EmbedBuilder,
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder
} from 'discord.js';

import loggerModule from '../../../services/logger';
import { CustomSlashCommandInteraction } from '../../../types/interactionTypes';
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
            return Promise.resolve();
        }

        const queue: NodeResolvable = useQueue(interaction.guild!.id)!;

        if (await queueDoesNotExist({ interaction, queue, executionId })) {
            return Promise.resolve();
        }

        if (await notInSameVoiceChannel({ interaction, queue, executionId })) {
            return Promise.resolve();
        }

        if (await queueNoCurrentTrack({ interaction, queue, executionId })) {
            return Promise.resolve();
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
            .setCustomId('filters-select-menu')
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
            .setCustomId('filters-disable-button')
            .setLabel('Disable all filters')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(embedOptions.icons.disable)
            .toJSON();

        const disableFiltersActionRow: APIActionRowComponent<APIMessageActionRowComponent> = {
            type: ComponentType.ActionRow,
            components: [disableButton]
        };

        logger.debug('Sending info embed with action row components.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription('**Toggle filters**\nEnable or disable audio filters for playback from the menu.')
                    .setColor(embedOptions.colors.info)
            ],
            components: [filterActionRow, disableFiltersActionRow]
        });
    }
};

export default command;
