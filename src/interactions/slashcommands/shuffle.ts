import { GuildQueue, useQueue } from 'discord-player';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { BaseSlashCommandInteraction } from '../../common/classes/interactions';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../types/interactionTypes';
import { checkQueueEmpty, checkQueueExists } from '../../common/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../common/validation/voiceChannelValidator';
import { localizeCommand, useServerTranslator } from '../../common/utils/localeUtil';
import { formatSlashCommand } from '../../common/utils/formattingUtils';

class ShuffleCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = localizeCommand(new SlashCommandBuilder().setName('shuffle'));
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
            checkQueueEmpty
        ]);

        queue.tracks.shuffle();
        logger.debug('Shuffled queue tracks.');

        logger.debug('Responding with success embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(this.getEmbedUserAuthor(interaction))
                    .setDescription(
                        translator('commands.shuffle.shuffledTracks', {
                            icon: this.embedOptions.icons.shuffled,
                            count: queue.tracks.data.length,
                            queueCommand: formatSlashCommand('queue', translator)
                        })
                    )
                    .setColor(this.embedOptions.colors.success)
            ]
        });
    }
}

export default new ShuffleCommand();
