import { type GuildQueue, type Track, useQueue } from 'discord-player';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import type { Logger } from '../../common/services/logger';
import { BaseSlashCommandInteraction } from '../../common/classes/interactions';
import type { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../types/interactionTypes';
import { checkQueueCurrentTrack, checkQueueExists } from '../../common/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../common/validation/voiceChannelValidator';
import { localizeCommand, useServerTranslator } from '../../common/utils/localeUtil';

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
        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(this.getEmbedUserAuthor(interaction))
                    .setDescription(
                        `${translator(
                            queue.node.isPaused()
                                ? 'commands.pause.pauseConfirmation'
                                : 'commands.pause.resumeConfirmation',
                            {
                                icon: this.embedOptions.icons.success
                            }
                        )}\n${this.getDisplayTrackDurationAndUrl(currentTrack, translator)}`
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
