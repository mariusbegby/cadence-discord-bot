import config from 'config';
import { GuildQueue, QueueFilters, useQueue } from 'discord-player';
import {
    APIActionRowComponent,
    APIButtonComponent,
    APIMessageActionRowComponent,
    APIStringSelectComponent,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    ComponentType,
    EmbedBuilder,
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder
} from 'discord.js';
import { Logger } from 'pino';
import { BaseSlashCommandInteraction } from '../../../classes/interactions';
import { FFmpegFilterOption, FFmpegFilterOptions } from '../../../types/configTypes';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../../types/interactionTypes';
import { checkQueueCurrentTrack, checkQueueExists } from '../../../utils/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../../utils/validation/voiceChannelValidator';

const ffmpegFilterOptions: FFmpegFilterOptions = config.get('ffmpegFilterOptions');

class FiltersCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = new SlashCommandBuilder()
            .setName('filters')
            .setDescription('Toggle various audio filters.')
            .addStringOption((option) =>
                option
                    .setName('type')
                    .setDescription('Audio filtering type to use.')
                    .setRequired(false)
                    .addChoices(
                        { name: 'FFmpeg', value: 'FFmpeg' },
                        { name: 'Biquad', value: 'Biquad' },
                        { name: 'Equalizer', value: 'Equalizer' },
                        { name: 'Disable', value: 'Disable' }
                    )
            );
        super(data);
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, interaction } = params;
        const logger = this.getLogger(this.name, executionId, interaction);

        const queue: GuildQueue = useQueue(interaction.guild!.id)!;

        await this.runValidators({ interaction, queue, executionId }, [
            checkInVoiceChannel,
            checkSameVoiceChannel,
            checkQueueExists,
            checkQueueCurrentTrack
        ]);

        const filterProvider: string = interaction.options.getString('type') || 'FFmpeg';

        switch (filterProvider.toLowerCase()) {
            case 'ffmpeg':
                logger.debug('Handling ffmpeg filters.');
                return await this.handleFfmpegFilters(logger, interaction, queue);
            case 'biquad':
                logger.debug('Handling biquad filters.');
                return await this.tempNotImplementedResponse(logger, interaction);
            case 'equalizer':
                logger.debug('Handling equalizer filters.');
                return await this.tempNotImplementedResponse(logger, interaction);
            case 'disable':
                logger.debug('Disabling filters.');
                return await this.tempDisableFilters(logger, interaction, queue);
        }
    }

    private async handleFfmpegFilters(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        queue: GuildQueue<unknown>
    ) {
        const filterOptions: StringSelectMenuOptionBuilder[] = [];

        ffmpegFilterOptions.availableFilters.forEach((filter: FFmpegFilterOption) => {
            let isEnabled: boolean = false;

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

        const filterSelect: APIStringSelectComponent = new StringSelectMenuBuilder()
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

        const disableButton: APIButtonComponent = new ButtonBuilder()
            .setCustomId('filters-disable-button')
            .setLabel('Disable all filters')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(this.embedOptions.icons.disable)
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
                    .setColor(this.embedOptions.colors.info)
            ],
            components: [filterActionRow, disableFiltersActionRow]
        });
    }

    private async tempDisableFilters(logger: Logger, interaction: ChatInputCommandInteraction, queue: GuildQueue) {
        if (queue.filters.ffmpeg.filters.length > 0) {
            queue.filters.ffmpeg.setFilters(false);
            logger.debug('Reset queue filters.');
        }

        logger.debug('Responding with success embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(await this.getEmbedUserAuthor(interaction))
                    .setDescription(
                        `**${this.embedOptions.icons.success} Disabled filters**\nAll audio filters have been disabled.`
                    )
                    .setColor(this.embedOptions.colors.success)
            ],
            components: []
        });
    }

    private async tempNotImplementedResponse(logger: Logger, interaction: ChatInputCommandInteraction) {
        logger.debug('Responding with info embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${this.embedOptions.icons.bot} Coming soon**\nThis functionality has not yet been implemented, and will be available soon.`
                    )
                    .setColor(this.embedOptions.colors.info)
            ],
            components: []
        });
    }
}

export default new FiltersCommand();
