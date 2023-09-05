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
import { queueDoesNotExist, queueNoCurrentTrack } from '../../../utils/validation/queueValidator';
import { notInSameVoiceChannel, notInVoiceChannel } from '../../../utils/validation/voiceChannelValidator';

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

        const validators = [
            () => notInVoiceChannel({ interaction, executionId }),
            () => notInSameVoiceChannel({ interaction, queue, executionId }),
            () => queueDoesNotExist({ interaction, queue, executionId }),
            () => queueNoCurrentTrack({ interaction, queue, executionId })
        ];

        for (const validator of validators) {
            if (await validator()) {
                return;
            }
        }

        const filterProvider: string = interaction.options.getString('type') || 'ffmpeg';

        switch (filterProvider) {
            case 'ffmpeg':
                logger.info('Handling ffmpeg filters.');
                return await this.handleFfmpegFilters(queue, logger, interaction);
            case 'biquad':
                logger.info('Biquad filters are not yet implemented.');
                break;
            case 'equalizer':
                logger.info('Equalizer filters are not yet implemented.');
                break;
            case 'disable':
                logger.info('Disabling filters.');
                if (queue.filters.ffmpeg.filters.length > 0) {
                    queue.filters.ffmpeg.setFilters(false);
                    logger.debug('Reset queue filters.');
                }
                logger.info('Response not yet implemented.');
        }
    }

    private async handleFfmpegFilters(
        queue: GuildQueue<unknown>,
        logger: Logger,
        interaction: ChatInputCommandInteraction
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
}

export default new FiltersCommand();
