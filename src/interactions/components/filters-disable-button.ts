import { GuildQueue, useQueue } from 'discord-player';
import { EmbedBuilder } from 'discord.js';
import { Logger } from 'pino';
import { BaseComponentInteraction } from '../../classes/interactions';
import { BaseComponentParams, BaseComponentReturnType } from '../../types/interactionTypes';
import { checkQueueExists } from '../../utils/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../utils/validation/voiceChannelValidator';

class FiltersDisableButtonComponent extends BaseComponentInteraction {
    constructor() {
        super('filters-disable-button');
    }

    async execute(params: BaseComponentParams): BaseComponentReturnType {
        const { executionId, interaction } = params;
        const logger = this.getLogger(this.name, executionId, interaction);

        const queue: GuildQueue = useQueue(interaction.guild!.id)!;

        await this.runValidators({ interaction, queue, executionId }, [
            checkInVoiceChannel,
            checkSameVoiceChannel,
            checkQueueExists
        ]);

        this.resetFilters(queue, logger);

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

    private resetFilters(queue: GuildQueue, logger: Logger): void {
        if (queue.filters.ffmpeg.filters.length > 0) {
            queue.filters.ffmpeg.setFilters(false);
            logger.debug('Reset queue filters.');
        }

        if (queue.filters.biquad) {
            queue.filters.biquad.disable();
        }
    }
}

export default new FiltersDisableButtonComponent();
