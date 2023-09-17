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
    Message,
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder
} from 'discord.js';
import { Logger } from 'pino';
import { BaseSlashCommandInteraction } from '../../../classes/interactions';
import {
    BiquadFilterOptions,
    EqualizerFilterOptions,
    FFmpegFilterOptions,
    FilterOption
} from '../../../types/configTypes';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../../types/interactionTypes';
import { checkQueueCurrentTrack, checkQueueExists } from '../../../utils/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../../utils/validation/voiceChannelValidator';

const ffmpegFilterOptions: FFmpegFilterOptions = config.get('ffmpegFilterOptions');
const biquadFilterOptions: BiquadFilterOptions = config.get('biquadFilterOptions');
const equalizerFilterOptions: EqualizerFilterOptions = config.get('equalizerFilterOptions');

class FiltersCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = new SlashCommandBuilder()
            .setName('filters')
            .setDescription('Toggle various audio filters.')
            .addStringOption((option) =>
                option
                    .setName('type')
                    .setDescription('Audio filter type to use.')
                    .setRequired(false)
                    .addChoices(
                        { name: 'FFmpeg', value: 'ffmpeg' },
                        { name: 'Biquad', value: 'biquad' },
                        { name: 'Equalizer', value: 'equalizer' },
                        { name: 'Disable', value: 'disable' }
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

        const filterProvider: string = interaction.options.getString('type') || 'ffmpeg';

        switch (filterProvider) {
            case 'ffmpeg':
                return await this.handleFfmpegFilters(logger, interaction, queue);
            case 'biquad':
                return await this.handleBiquadFilters(logger, interaction, queue);
            case 'equalizer':
                return await this.handleEqualizerFilters(logger, interaction);
            case 'disable':
                return await this.disableAllFiltersAndRespondWithSuccess(logger, interaction, queue);
        }
    }

    private async handleFfmpegFilters(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        queue: GuildQueue<unknown>
    ): Promise<Message> {
        logger.debug('Handling ffmpeg filters.');
        const filterOptions: StringSelectMenuOptionBuilder[] = [];

        ffmpegFilterOptions.availableFilters.forEach((filter: FilterOption) => {
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

        return await this.sendFiltersEmbed(logger, interaction, 'ffmpeg', filterOptions);
    }

    private async handleBiquadFilters(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        queue: GuildQueue<unknown>
    ): Promise<Message> {
        logger.debug('Handling biquad filters.');
        const filterOptions: StringSelectMenuOptionBuilder[] = [];

        biquadFilterOptions.availableFilters.forEach((filter: FilterOption) => {
            let isEnabled: boolean = false;
            if (queue.filters.biquad!.biquadFilter === (filter.value as keyof BiquadFilterType)) {
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

        return await this.sendFiltersEmbed(logger, interaction, 'biquad', filterOptions);
    }

    private async handleEqualizerFilters(logger: Logger, interaction: ChatInputCommandInteraction): Promise<Message> {
        logger.debug('Handling biquad filters.');
        const filterOptions: StringSelectMenuOptionBuilder[] = [];

        equalizerFilterOptions.availableFilters.forEach((filter: FilterOption) => {
            filterOptions.push(
                new StringSelectMenuOptionBuilder()
                    .setLabel(filter.label)
                    .setDescription(filter.description)
                    .setValue(filter.value)
                    .setEmoji(filter.emoji)
                    .setDefault(false)
            );
        });

        return await this.sendFiltersEmbed(logger, interaction, 'equalizer', filterOptions);
    }

    private async sendFiltersEmbed(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        filterProvider: string,
        filterOptions: StringSelectMenuOptionBuilder[]
    ): Promise<Message> {
        const actionRows = this.buildFilterActionRows(filterOptions, filterProvider);

        logger.debug('Sending info embed with action row components.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**Toggle filters (${filterProvider})**\n` +
                            'Enable or disable audio filters for playback from the menu.'
                    )
                    .setColor(this.embedOptions.colors.info)
            ],
            components: actionRows
        });
    }

    private buildFilterActionRows(
        filterOptions: StringSelectMenuOptionBuilder[],
        filterProvider: string
    ): APIActionRowComponent<APIMessageActionRowComponent>[] {
        const filterSelect: APIStringSelectComponent = new StringSelectMenuBuilder()
            .setCustomId(`filters-select-menu_${filterProvider}`)
            .setPlaceholder(
                filterProvider === 'ffmpeg' ? 'Select one or multiple filters.' : 'Select a filter from the menu.'
            )
            .setMinValues(0)
            .setMaxValues(1)
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

        return [filterActionRow, disableFiltersActionRow];
    }

    private async disableAllFiltersAndRespondWithSuccess(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        queue: GuildQueue
    ): Promise<Message> {
        if (queue.filters.ffmpeg.filters.length > 0) {
            queue.filters.ffmpeg.setFilters(false);
        }

        if (queue.filters.biquad) {
            queue.filters.biquad.disable();
        }

        if (queue.filters.equalizer) {
            queue.filters.equalizer.disable();
        }

        logger.debug('Reset queue filters.');

        logger.debug('Responding with success embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(this.getEmbedUserAuthor(interaction))
                    .setDescription(
                        `**${this.embedOptions.icons.success} Disabled filters**\n` +
                            'All audio filters have been disabled.'
                    )
                    .setColor(this.embedOptions.colors.success)
            ],
            components: []
        });
    }
}

export default new FiltersCommand();
