import { GuildQueue, useQueue } from 'discord-player';
import { EmbedBuilder, GuildMember, SlashCommandBuilder } from 'discord.js';
import {
    BaseSlashCommandInteraction,
    BaseSlashCommandParams,
    BaseSlashCommandReturnType
} from '../../../types/interactionTypes';
import { queueDoesNotExist } from '../../../utils/validation/queueValidator';
import { notInSameVoiceChannel, notInVoiceChannel } from '../../../utils/validation/voiceChannelValidator';

class StopCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = new SlashCommandBuilder()
            .setName('stop')
            .setDescription('Stop playing audio and clear the track queue.');
        super(data);
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, interaction } = params;
        const logger = this.getLogger(this.commandName, executionId, interaction);

        const queue: GuildQueue = useQueue(interaction.guild!.id)!;

        const validators = [
            () => notInVoiceChannel({ interaction, executionId }),
            () => notInSameVoiceChannel({ interaction, queue, executionId }),
            () => queueDoesNotExist({ interaction, queue, executionId })
        ];

        for (const validator of validators) {
            if (await validator()) {
                return;
            }
        }

        if (!queue.deleted) {
            queue.setRepeatMode(0);
            queue.clear();
            queue.node.stop();
            logger.debug('Cleared and stopped the queue.');
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
                        `**${this.embedOptions.icons.success} Stopped playing**\nStopped playing audio and cleared the track queue.\n\nTo play more music, use the **\`/play\`** command!`
                    )
                    .setColor(this.embedOptions.colors.success)
            ]
        });
    }
}

export default new StopCommand();
