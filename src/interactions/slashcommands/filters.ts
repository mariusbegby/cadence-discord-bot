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
import { Logger } from '../../common/services/logger';
import { BaseSlashCommandInteraction } from '../../common/classes/interactions';
import {
    BiquadFilterOptions,
    EqualizerFilterOptions,
    FFmpegFilterOptions,
    FilterOption
} from '../../types/configTypes';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../types/interactionTypes';
import { checkQueueCurrentTrack, checkQueueExists } from '../../common/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../common/validation/voiceChannelValidator';
import { localizeCommand, useServerTranslator } from '../../common/utils/localeUtil';
import { TFunction } from 'i18next';

const ffmpegFilterOptions: FFmpegFilterOptions = config.get('ffmpegFilterOptions');
const biquadFilterOptions: BiquadFilterOptions = config.get('biquadFilterOptions');
const equalizerFilterOptions: EqualizerFilterOptions = config.get('equalizerFilterOptions');

class FiltersCommand extends BaseSlashCommandInteraction {
    constructor() {
        // TODO: Implement system for localized filter names and descriptions
        const data = localizeCommand(
            new SlashCommandBuilder()
                .setName('filters')
                .addStringOption((option) =>
                    option
                        .setName('type')
                        .setRequired(false)
                        .addChoices(
                            { value: 'ffmpeg', name: ' ' },
                            { value: 'biquad', name: ' ' },
                            { value: 'equalizer', name: ' ' },
                            { value: 'disable', name: ' ' }
                        )
                )
        );
        super(data);
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, interaction } = params;
        const logger = this.getLogger(this.name, executionId, interaction);
        const translator = useServerTranslator(interaction);

        const queue: GuildQueue = useQueue(interaction.guild!.id)!;

        await this.runValidators({ interaction, queue, executionId }, [
            checkInVoiceChannel,
            checkSameVoiceChannel,
            checkQueueExists,
            checkQueueCurrentTrack
        ]);

        await interaction.deferReply();
        logger.debug('Interaction deferred.');

        const filterProvider: string = interaction.options.getString('type') || 'ffmpeg';

        switch (filterProvider) {
            case 'ffmpeg':
                return await this.handleFfmpegFilters(logger, interaction, queue, translator);
            case 'biquad':
                return await this.handleBiquadFilters(logger, interaction, queue, translator);
            case 'equalizer':
                return await this.handleEqualizerFilters(logger, interaction, translator);
            case 'disable':
                return await this.disableAllFiltersAndRespondWithSuccess(logger, interaction, queue, translator);
        }
    }

    private async handleFfmpegFilters(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        queue: GuildQueue<unknown>,
        translator: TFunction
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

        return await this.sendFiltersEmbed(logger, interaction, 'ffmpeg', filterOptions, translator);
    }

    private async handleBiquadFilters(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        queue: GuildQueue<unknown>,
        translator: TFunction
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

        return await this.sendFiltersEmbed(logger, interaction, 'biquad', filterOptions, translator);
    }

    private async handleEqualizerFilters(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        translator: TFunction
    ): Promise<Message> {
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

        return await this.sendFiltersEmbed(logger, interaction, 'equalizer', filterOptions, translator);
    }

    private async sendFiltersEmbed(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        filterProvider: string,
        filterOptions: StringSelectMenuOptionBuilder[],
        translator: TFunction
    ): Promise<Message> {
        const actionRows = this.buildFilterActionRows(filterOptions, filterProvider, translator);

        logger.debug('Sending info embed with action row components.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        translator('commands.filters.toggleFilterInstructions', {
                            provider: filterProvider
                        })
                    )
                    .setColor(this.embedOptions.colors.info)
            ],
            components: actionRows
        });
    }

    private buildFilterActionRows(
        filterOptions: StringSelectMenuOptionBuilder[],
        filterProvider: string,
        translator: TFunction
    ): APIActionRowComponent<APIMessageActionRowComponent>[] {
        const filterSelect: APIStringSelectComponent = new StringSelectMenuBuilder()
            .setCustomId(`filters-select-menu_${filterProvider}`)
            .setPlaceholder(
                filterProvider === 'ffmpeg'
                    ? translator('commands.filters.selectFilterPlaceholderMany')
                    : translator('commands.filters.selectFilterPlaceholder')
            )
            .setMinValues(0)
            .setMaxValues(filterProvider === 'ffmpeg' ? ffmpegFilterOptions.maxFilters : 1)
            .addOptions(filterOptions)
            .toJSON();

        const filterActionRow: APIActionRowComponent<APIMessageActionRowComponent> = {
            type: ComponentType.ActionRow,
            components: [filterSelect]
        };

        const disableButton: APIButtonComponent = new ButtonBuilder()
            .setCustomId('filters-disable-button')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(this.embedOptions.icons.disable)
            .toJSON();

        if (this.embedOptions.components.showButtonLabels) {
            disableButton.label = translator('commands.filters.disableAllFiltersButton');
        }

        const disableFiltersActionRow: APIActionRowComponent<APIMessageActionRowComponent> = {
            type: ComponentType.ActionRow,
            components: [disableButton]
        };

        return [filterActionRow, disableFiltersActionRow];
    }

    private async disableAllFiltersAndRespondWithSuccess(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        queue: GuildQueue,
        translator: TFunction
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
                        translator('commands.filters.allFiltersDisabled', {
                            icon: this.embedOptions.icons.success
                        })
                    )
                    .setColor(this.embedOptions.colors.success)
            ],
            components: []
        });
    }
}

export default new FiltersCommand();
