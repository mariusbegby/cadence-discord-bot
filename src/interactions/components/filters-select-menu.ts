import config from 'config';
import { GuildQueue, QueueFilters, useQueue } from 'discord-player';
import { EmbedBuilder, StringSelectMenuInteraction } from 'discord.js';
import { BaseComponentInteraction } from '../../classes/interactions';
import { FFmpegFilterOption, FFmpegFilterOptions } from '../../types/configTypes';
import { BaseComponentParams, BaseComponentReturnType } from '../../types/interactionTypes';
import { checkQueueExists } from '../../utils/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../utils/validation/voiceChannelValidator';

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

        logger.debug('Responding with success embed.');
        return await selectMenuInteraction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(await this.getEmbedUserAuthor(interaction))
                    .setDescription(
                        `**${
                            this.embedOptions.icons.success
                        } Filters toggled**\nNow using these filters:\n${selectMenuInteraction.values
                            .map((enabledFilter: string) => {
                                const filter: FFmpegFilterOption | undefined =
                                    ffmpegFilterOptions.availableFilters.find(
                                        (filter) => enabledFilter == filter.value
                                    );

                                if (!filter) {
                                    return enabledFilter;
                                }

                                return `- **${filter.emoji} ${filter.label}**`;
                            })
                            .join('\n')}`
                    )
                    .setColor(this.embedOptions.colors.success)
            ],
            components: []
        });
    }
}

export default new FiltersSelectMenuComponent();
