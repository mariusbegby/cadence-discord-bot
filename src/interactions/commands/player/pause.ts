import { GuildQueue, Track, useQueue } from 'discord-player';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { BaseSlashCommandInteraction } from '../../../classes/interactions';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../../types/interactionTypes';
import { checkQueueCurrentTrack, checkQueueExists } from '../../../utils/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../../utils/validation/voiceChannelValidator';

class PauseCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = new SlashCommandBuilder().setName('pause').setDescription('Toggle pause for the current track.');
        super(data);

        this.validators = [
            (args) => checkInVoiceChannel(args),
            (args) => checkSameVoiceChannel(args),
            (args) => checkQueueExists(args),
            (args) => checkQueueCurrentTrack(args)
        ];
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, interaction } = params;
        const logger = this.getLogger(this.name, executionId, interaction);

        const queue: GuildQueue = useQueue(interaction.guild!.id)!;

        await this.runValidators({ interaction, queue, executionId });

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

        logger.debug('Responding with success embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(await this.getEmbedUserAuthor(interaction))
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
