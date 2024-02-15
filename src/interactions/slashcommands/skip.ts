import { GuildQueue, Track, useQueue } from 'discord-player';
import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { BaseSlashCommandInteraction } from '../../common/classes/interactions';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../types/interactionTypes';
import { checkQueueCurrentTrack, checkQueueExists } from '../../common/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../common/validation/voiceChannelValidator';
import { Logger } from '../../common/services/logger';
import { localizeCommand, useServerTranslator, Translator } from '../../common/utils/localeUtil';
import { formatRepeatModeDetailed, formatSlashCommand } from '../../common/utils/formattingUtils';

class SkipCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = localizeCommand(
            new SlashCommandBuilder()
                .setName('skip')
                .addIntegerOption((option) => option.setName('position').setMinValue(1))
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

        const trackPositionInput: number = interaction.options.getInteger('position')!;

        if (trackPositionInput) {
            return await this.handleSkipToTrackPosition(logger, interaction, queue, trackPositionInput, translator);
        } else {
            return await this.handleSkipToNextTrack(logger, interaction, queue, translator);
        }
    }

    private async handleSkipToTrackPosition(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        queue: GuildQueue,
        trackPosition: number,
        translator: Translator
    ) {
        if (trackPosition > queue.tracks.data.length) {
            return await this.handleTrackPositionHigherThanQueueLength(
                trackPosition,
                queue,
                logger,
                interaction,
                translator
            );
        } else {
            const skippedTrack: Track = queue.currentTrack!;
            queue.node.skipTo(trackPosition - 1);
            logger.debug('Skipped to specified track position.');
            return await this.respondWithSuccessEmbed(skippedTrack, interaction, queue, translator);
        }
    }

    private async handleTrackPositionHigherThanQueueLength(
        trackPosition: number,
        queue: GuildQueue,
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        translator: Translator
    ) {
        logger.debug('Specified track position was higher than total tracks.');
        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        translator('commands.skip.trackPositionHigherThanQueueLength', {
                            icon: this.embedOptions.icons.warning,
                            position: trackPosition,
                            queueCommand: formatSlashCommand('queue', translator),
                            count: queue.tracks.data.length
                        })
                    )
                    .setColor(this.embedOptions.colors.warning)
            ],
            ephemeral: true
        });
    }

    private async handleSkipToNextTrack(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        queue: GuildQueue,
        translator: Translator
    ) {
        if (queue.tracks.data.length === 0 && !queue.currentTrack) {
            return await this.handleNoTracksInQueueAndNoCurrentTrack(logger, interaction, translator);
        }

        const skippedTrack: Track = queue.currentTrack!;
        queue.node.skip();
        logger.debug('Skipped current track.');
        return await this.respondWithSuccessEmbed(skippedTrack, interaction, queue, translator);
    }

    private async handleNoTracksInQueueAndNoCurrentTrack(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        translator: Translator
    ) {
        logger.debug('No tracks in queue and no current track.');
        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        translator('commands.skip.emptyQueue', {
                            icon: this.embedOptions.icons.warning,
                            playCommand: formatSlashCommand('play', translator)
                        })
                    )
                    .setColor(this.embedOptions.colors.warning)
            ],
            ephemeral: true
        });
    }

    private async respondWithSuccessEmbed(
        skippedTrack: Track,
        interaction: ChatInputCommandInteraction,
        queue: GuildQueue,
        translator: Translator
    ) {
        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(this.getEmbedUserAuthor(interaction))
                    .setDescription(
                        translator('commands.skip.skippedTrack', {
                            icon: this.embedOptions.icons.skipped
                        }) +
                            '\n' +
                            `${this.getDisplayTrackDurationAndUrl(skippedTrack, translator)}\n` +
                            `${formatRepeatModeDetailed(queue.repeatMode, this.embedOptions, translator, 'success')}`
                    )
                    .setThumbnail(this.getTrackThumbnailUrl(skippedTrack))
                    .setColor(this.embedOptions.colors.success)
            ]
        });
    }
}

export default new SkipCommand();
