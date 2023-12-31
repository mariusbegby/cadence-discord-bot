import { GuildQueue, Track, useQueue } from 'discord-player';
import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { BaseSlashCommandInteraction } from '../../../classes/interactions';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../../types/interactionTypes';
import { checkQueueCurrentTrack, checkQueueExists } from '../../../utils/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../../utils/validation/voiceChannelValidator';
import { Logger } from 'pino';
import { localizeCommand, useServerTranslator } from '../../../common/localeUtil';
import { TFunction } from 'i18next';
import { formatSlashCommand } from '../../../common/formattingUtils';

class MoveCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = localizeCommand(
            new SlashCommandBuilder()
                .setName('move')
                .addIntegerOption((option) => option.setName('from').setMinValue(1).setRequired(true))
                .addIntegerOption((option) => option.setName('to').setMinValue(1).setRequired(true))
        );
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

        const fromPositionInput: number = interaction.options.getInteger('from')!;
        const toPositionInput: number = interaction.options.getInteger('to')!;
        return await this.handleMoveTrackToPosition(
            logger,
            interaction,
            queue,
            fromPositionInput,
            toPositionInput,
            translator
        );
    }

    private async handleMoveTrackToPosition(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        queue: GuildQueue,
        fromPosition: number,
        toPosition: number,
        translator: TFunction
    ) {
        if (fromPosition > queue.tracks.data.length || toPosition > queue.tracks.data.length) {
            logger.debug('One of the specified track positions was higher than total tracks.');
            return await this.handleTrackPositionHigherThanQueueLength(
                fromPosition,
                toPosition,
                queue,
                logger,
                interaction,
                translator
            );
        } else {
            const trackToMove: Track = queue.tracks.data[fromPosition - 1];
            queue.node.move(trackToMove, toPosition - 1);
            logger.debug(`Moved track from position ${fromPosition} to position ${toPosition} in queue`);
            return await this.respondWithSuccessEmbed(trackToMove, interaction, fromPosition, toPosition, translator);
        }
    }

    private async handleTrackPositionHigherThanQueueLength(
        fromPosition: number,
        toPosition: number,
        queue: GuildQueue,
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        translator: TFunction
    ) {
        logger.debug('One of the specified track positions was higher than total tracks.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        translator('commands.move.trackPositionHigherThanQueueLength', {
                            icon: this.embedOptions.icons.warning,
                            fromPosition,
                            toPosition,
                            count: queue.tracks.data.length,
                            queueCommand: formatSlashCommand('queue', translator)
                        })
                    )
                    .setColor(this.embedOptions.colors.warning)
            ]
        });
    }

    private async respondWithSuccessEmbed(
        movedTrack: Track,
        interaction: ChatInputCommandInteraction,
        fromPosition: number,
        toPosition: number,
        translator: TFunction
    ) {
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(this.getEmbedUserAuthor(interaction))
                    .setDescription(
                        translator('commands.move.trackMoved', {
                            icon: this.embedOptions.icons.moved,
                            track: this.getDisplayTrackDurationAndUrl(movedTrack, translator),
                            fromPosition,
                            toPosition
                        })
                    )
                    .setThumbnail(this.getTrackThumbnailUrl(movedTrack))
                    .setColor(this.embedOptions.colors.success)
            ]
        });
    }
}

export default new MoveCommand();
