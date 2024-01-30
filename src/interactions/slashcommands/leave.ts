import { GuildQueue, useQueue } from 'discord-player';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { BaseSlashCommandInteraction } from '../../classes/interactions';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../types/interactionTypes';
import { checkQueueExists } from '../../utils/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../utils/validation/voiceChannelValidator';
import { localizeCommand, useServerTranslator } from '../../common/localeUtil';
import { formatSlashCommand } from '../../common/formattingUtils';

class LeaveCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = localizeCommand(new SlashCommandBuilder().setName('leave'));
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

        logger.debug('Deleting queue.');
        this.deleteQueue(queue);

        logger.debug('Responding with success embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(this.getEmbedUserAuthor(interaction))
                    .setDescription(
                        translator('commands.leave.leavingChannel', {
                            icon: this.embedOptions.icons.success,
                            playCommand: formatSlashCommand('play', translator)
                        })
                    )
                    .setColor(this.embedOptions.colors.success)
            ]
        });
    }

    private deleteQueue(queue: GuildQueue): void {
        if (!queue.deleted) {
            queue.delete();
        }
    }
}

export default new LeaveCommand();
