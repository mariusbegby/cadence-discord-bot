import { GuildQueue, useQueue } from 'discord-player';
import { EmbedBuilder, GuildMember } from 'discord.js';
import { BaseComponentParams, BaseComponentReturnType } from '../../types/interactionTypes';
import { BaseComponentInteraction } from '../../classes/interactions';
import { checkQueueExists } from '../../utils/validation/queueValidator';
import { checkSameVoiceChannel, checkInVoiceChannel } from '../../utils/validation/voiceChannelValidator';

class FiltersDisableButtonComponent extends BaseComponentInteraction {
    constructor() {
        super('filters-disable-button');

        this.validators = [
            (args) => checkInVoiceChannel(args),
            (args) => checkSameVoiceChannel(args),
            (args) => checkQueueExists(args)
        ];
    }

    async execute(params: BaseComponentParams): BaseComponentReturnType {
        const { executionId, interaction } = params;
        const logger = this.getLogger(this.name, executionId, interaction);

        const queue: GuildQueue = useQueue(interaction.guild!.id)!;

        await this.runValidators({ interaction, queue, executionId });

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

        logger.debug('Responding with success embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: authorName,
                        iconURL: interaction.user.avatarURL() || this.embedOptions.info.fallbackIconUrl
                    })
                    .setDescription(
                        `**${this.embedOptions.icons.success} Disabled filters**\nAll audio filters have been disabled.`
                    )
                    .setColor(this.embedOptions.colors.success)
            ],
            components: []
        });
    }
}

export default new FiltersDisableButtonComponent();
