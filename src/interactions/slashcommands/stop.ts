import { GuildQueue, QueueRepeatMode, useQueue } from 'discord-player';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { BaseSlashCommandInteraction } from '../../common/classes/interactions';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../types/interactionTypes';
import { checkQueueExists } from '../../common/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../common/validation/voiceChannelValidator';
import { localizeCommand, useServerTranslator } from '../../common/utils/localeUtil';
import { formatSlashCommand } from '../../common/utils/formattingUtils';

class StopCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = localizeCommand(new SlashCommandBuilder().setName('stop'));
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
            checkQueueExists
        ]);

        if (!queue.deleted) {
            queue.setRepeatMode(QueueRepeatMode.OFF);
            queue.node.stop();
            logger.debug('Cleared and stopped the queue.');
        }

        logger.debug('Responding with success embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(this.getEmbedUserAuthor(interaction))
                    .setDescription(
                        translator('commands.stop.stoppedPlaying', {
                            icon: this.embedOptions.icons.success,
                            playCommand: formatSlashCommand('play', translator)
                        })
                    )
                    .setColor(this.embedOptions.colors.success)
            ]
        });
    }
}

export default new StopCommand();
