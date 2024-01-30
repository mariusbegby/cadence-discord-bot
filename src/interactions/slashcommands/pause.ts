import { GuildQueue, Track, useQueue } from 'discord-player';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Logger } from 'pino';
import { BaseSlashCommandInteraction } from '../../classes/interactions';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../types/interactionTypes';
import { checkQueueCurrentTrack, checkQueueExists } from '../../utils/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../utils/validation/voiceChannelValidator';
import { localizeCommand, useServerTranslator } from '../../common/localeUtil';

class PauseCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = localizeCommand(new SlashCommandBuilder().setName('pause'));
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
            checkQueueCurrentTrack
        ]);

        const currentTrack: Track = queue.currentTrack!;

        this.togglePauseState(logger, queue);

        logger.debug('Responding with success embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(this.getEmbedUserAuthor(interaction))
                    .setDescription(
                        translator(
                            queue.node.isPaused()
                                ? 'commands.pause.pauseConfirmation'
                                : 'commands.pause.resumeConfirmation',
                            {
                                icon: this.embedOptions.icons.success
                            }
                        ) +
                            '\n' +
                            this.getDisplayTrackDurationAndUrl(currentTrack, translator)
                    )
                    .setThumbnail(currentTrack.thumbnail)
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
