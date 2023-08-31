import { GuildQueue, Track, useQueue } from 'discord-player';
import { EmbedBuilder, GuildMember, SlashCommandBuilder } from 'discord.js';

import {
    BaseSlashCommandInteraction,
    BaseSlashCommandParams,
    BaseSlashCommandReturnType
} from '../../../types/interactionTypes';
import { queueDoesNotExist, queueNoCurrentTrack } from '../../../utils/validation/queueValidator';
import { notInSameVoiceChannel, notInVoiceChannel } from '../../../utils/validation/voiceChannelValidator';

class PauseCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = new SlashCommandBuilder().setName('pause').setDescription('Toggle pause for the current track.');
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

        const currentTrack: Track = queue.currentTrack!;

        let durationFormat =
            Number(currentTrack.raw.duration) === 0 || currentTrack.duration === '0:00'
                ? ''
                : `\`${currentTrack.duration}\``;

        if (currentTrack.raw.live) {
            durationFormat = `${this.embedOptions.icons.liveTrack} \`LIVE\``;
        }

        // change paused state to opposite of current state
        queue.node.setPaused(!queue.node.isPaused());
        logger.debug(`Set paused state to ${queue.node.isPaused()}.`);

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
                        `**${this.embedOptions.icons.pauseResumed} ${
                            queue.node.isPaused() ? 'Paused Track' : 'Resumed track'
                        }**\n**${durationFormat} [${currentTrack.title}](${currentTrack.raw.url ?? currentTrack.url})**`
                    )
                    .setThumbnail(currentTrack.thumbnail)
                    .setColor(this.embedOptions.colors.success)
            ]
        });
    }
}

export default new PauseCommand();
