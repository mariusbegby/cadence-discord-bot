import config from 'config';
import { GuildQueue, QueueFilters, useQueue } from 'discord-player';
import { EmbedBuilder, StringSelectMenuInteraction } from 'discord.js';
import { BaseComponentInteraction } from '../../classes/interactions';
import { FFmpegFilterOption, FFmpegFilterOptions } from '../../types/configTypes';
import { BaseComponentParams, BaseComponentReturnType } from '../../types/interactionTypes';
import { checkQueueExists } from '../../utils/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../utils/validation/voiceChannelValidator';
import { Logger } from 'pino';

const ffmpegFilterOptions: FFmpegFilterOptions = config.get('ffmpegFilterOptions');

class FiltersSelectMenuComponent extends BaseComponentInteraction {
    constructor() {
        super('filters-select-menu');
    }

    async execute(params: BaseComponentParams): BaseComponentReturnType {
        const { executionId, interaction } = params;
        const logger = this.getLogger(this.name, executionId, interaction);

        logger.debug('Received select menu confirmation.');

        const selectMenuInteraction: StringSelectMenuInteraction = interaction as StringSelectMenuInteraction;
        const queue: GuildQueue = useQueue(interaction.guild!.id)!;

        await this.runValidators({ interaction, queue, executionId }, [
            checkInVoiceChannel,
            checkSameVoiceChannel,
            checkQueueExists
        ]);

        this.resetFilters(queue, logger);
        this.enableNormalizerIfRequired(selectMenuInteraction);
        this.enableProvidedFilters(selectMenuInteraction, queue, logger);

        logger.debug('Responding with success embed.');
        return await selectMenuInteraction.editReply({
            embeds: [this.buildSuccessEmbed(selectMenuInteraction)],
            components: []
        });
    }

    private resetFilters(queue: GuildQueue, logger: Logger) {
        if (queue.filters.ffmpeg.filters.length > 0) {
            queue.filters.ffmpeg.setFilters(false);
            logger.debug('Reset queue filters.');
        }
    }

    private enableNormalizerIfRequired(selectMenuInteraction: StringSelectMenuInteraction) {
        if (
            ffmpegFilterOptions.forceNormalizerByBassBoost &&
            (selectMenuInteraction.values.includes('bassboost_low') ||
                selectMenuInteraction.values.includes('bassboost')) &&
            !selectMenuInteraction.values.includes('normalizer')
        ) {
            selectMenuInteraction.values.push('normalizer');
        }
    }

    private enableProvidedFilters(
        selectMenuInteraction: StringSelectMenuInteraction,
        queue: GuildQueue,
        logger: Logger
    ) {
        queue.filters.ffmpeg.toggle(selectMenuInteraction.values as (keyof QueueFilters)[]);
        logger.debug(`Enabled filters ${selectMenuInteraction.values.join(', ')}.`);
    }

    private buildSuccessEmbed(selectMenuInteraction: StringSelectMenuInteraction) {
        const enabledFilters: string = selectMenuInteraction.values
            .map((enabledFilter: string) => {
                const filter: FFmpegFilterOption | undefined = ffmpegFilterOptions.availableFilters.find(
                    (filter) => enabledFilter == filter.value
                );

                if (!filter) {
                    return enabledFilter;
                }

                return `**${filter.emoji} ${filter.label}**`;
            })
            .join(', ');

        return new EmbedBuilder()
            .setDescription(
                `**${this.embedOptions.icons.nyctophileZuiModified} | Filter** telah di modifikasi menjadi: ${enabledFilters}`
            )
            .setColor(this.embedOptions.colors.success);
    }
}

export default new FiltersSelectMenuComponent();
