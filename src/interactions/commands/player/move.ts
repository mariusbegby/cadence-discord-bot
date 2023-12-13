import { GuildQueue, Track, useQueue } from 'discord-player';
import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { BaseSlashCommandInteraction } from '../../../classes/interactions';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../../types/interactionTypes';
import { checkQueueCurrentTrack, checkQueueExists } from '../../../utils/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../../utils/validation/voiceChannelValidator';
import { Logger } from 'pino';

class MoveCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = new SlashCommandBuilder()
            .setName('move')
            .setDescription('Move a track to a specified position in queue.')
            .addIntegerOption((option) =>
                option
                    .setName('from')
                    .setDescription('The position of the track to move')
                    .setMinValue(1)
                    .setRequired(true)
            )
            .addIntegerOption((option) =>
                option
                    .setName('to')
                    .setDescription('The position to move the track to')
                    .setMinValue(1)
                    .setRequired(true)
            );
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

        const fromPositionInput: number = interaction.options.getInteger('from')!;
        const toPositionInput: number = interaction.options.getInteger('to')!;
        return await this.handleMoveTrackToPosition(logger, interaction, queue, fromPositionInput, toPositionInput);
    }

    private async handleMoveTrackToPosition(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        queue: GuildQueue,
        fromPosition: number,
        toPosition: number
    ) {
        if (fromPosition > queue.tracks.data.length || toPosition > queue.tracks.data.length) {
            logger.debug('One of the specified track positions was higher than total tracks.');
            return await this.handleTrackPositionHigherThanQueueLength(
                fromPosition,
                toPosition,
                queue,
                logger,
                interaction
            );
        } else {
            const trackToMove: Track = queue.tracks.data[fromPosition - 1];
            queue.node.move(trackToMove, toPosition - 1);
            logger.debug(`Moved track from position ${fromPosition} to position ${toPosition} in queue`);
            return await this.respondWithSuccessEmbed(trackToMove, interaction, fromPosition, toPosition);
        }
    }

    private async handleTrackPositionHigherThanQueueLength(
        fromPosition: number,
        toPosition: number,
        queue: GuildQueue,
        logger: Logger,
        interaction: ChatInputCommandInteraction
    ) {
        logger.debug('One of the specified track positions was higher than total tracks.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${this.embedOptions.icons.warning} Oops!**\n` +
                            `You cannot move track in position **\`${fromPosition}\`** to position **\`${toPosition}\`**. There are only **\`${queue.tracks.data.length}\`** tracks in the queue.\n\n` +
                            'View tracks added to the queue with **`/queue`**.'
                    )
                    .setColor(this.embedOptions.colors.warning)
            ]
        });
    }

    private async respondWithSuccessEmbed(
        movedTrack: Track,
        interaction: ChatInputCommandInteraction,
        fromPosition: number,
        toPosition: number
    ) {
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(this.getEmbedUserAuthor(interaction))
                    .setDescription(
                        `**${this.embedOptions.icons.moved} Moved track**\n` +
                            `${this.getDisplayTrackDurationAndUrl(movedTrack)}\n\n` +
                            `Track has been moved from position **\`${fromPosition}\`** to position **\`${toPosition}\`**.`
                    )
                    .setThumbnail(this.getTrackThumbnailUrl(movedTrack))
                    .setColor(this.embedOptions.colors.success)
            ]
        });
    }
}

export default new MoveCommand();
