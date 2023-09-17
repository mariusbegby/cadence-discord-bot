import { GuildQueue, Track, useQueue } from 'discord-player';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Logger } from 'pino';
import { BaseSlashCommandInteraction } from '../../../classes/interactions';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../../types/interactionTypes';
import { checkQueueCurrentTrack, checkQueueExists } from '../../../utils/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../../utils/validation/voiceChannelValidator';

class PauseCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = new SlashCommandBuilder()
            .setName('pause')
            .setDescription('Jeda lagu (tracks) yang sedang dimainkan');
        super(data);
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, interaction } = params;
        const logger = this.getLogger(this.name, executionId, interaction);
        const queue: GuildQueue = useQueue(interaction.guild!.id)!;

        await this.runValidators({ interaction, queue, executionId }, [
            checkInVoiceChannel,
            checkSameVoiceChannel,
            checkQueueExists,
            checkQueueCurrentTrack
        ]);

        const currentTrack: Track = queue.currentTrack!;
        this.togglePauseState(logger, queue);

        logger.debug('Responding with success embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `${
                            queue.node.isPaused()
                                ? `**${this.embedOptions.icons.nyctophileZuiThumbsDown} | Dijeda**`
                                : `**${this.embedOptions.icons.nyctophileZuiThumbsUp} | Dilanjutkan**`
                        } ${this.getFormattedTrackUrl(currentTrack)}.`
                    )
                    .setColor(this.embedOptions.colors.success)
            ]
        });
    }

    private togglePauseState(logger: Logger, queue: GuildQueue): void {
        queue.node.setPaused(!queue.node.isPaused());
        logger.debug(`Set paused state to ${queue.node.isPaused()}.`);
    }
}

export default new PauseCommand();
