import { type GuildQueue, type Track, useQueue } from 'discord-player';
import { type ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { BaseSlashCommandInteraction } from '../../common/classes/interactions';
import type { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../types/interactionTypes';
import { checkQueueCurrentTrack, checkQueueExists } from '../../common/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../common/validation/voiceChannelValidator';
import type { Logger } from '../../common/services/logger';
import { localizeCommand, useServerTranslator, type Translator } from '../../common/utils/localeUtil';
import { formatSlashCommand } from '../../common/utils/formattingUtils';

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
        translator: Translator
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
        }
        const trackToMove: Track = queue.tracks.data[fromPosition - 1];
        queue.node.move(trackToMove, toPosition - 1);
        logger.debug(`Moved track from position ${fromPosition} to position ${toPosition} in queue`);
        return await this.respondWithSuccessEmbed(trackToMove, interaction, fromPosition, toPosition, translator);
    }

    private async handleTrackPositionHigherThanQueueLength(
        fromPosition: number,
        toPosition: number,
        queue: GuildQueue,
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        translator: Translator
    ) {
        logger.debug('One of the specified track positions was higher than total tracks.');
        return await interaction.reply({
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
            ],
            ephemeral: true
        });
    }

    private async respondWithSuccessEmbed(
        movedTrack: Track,
        interaction: ChatInputCommandInteraction,
        fromPosition: number,
        toPosition: number,
        translator: Translator
    ) {
        return await interaction.reply({
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
