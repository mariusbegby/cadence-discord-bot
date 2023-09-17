import { GuildQueue, Track, useQueue } from 'discord-player';
import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { BaseSlashCommandInteraction } from '../../../classes/interactions';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../../types/interactionTypes';
import { checkQueueCurrentTrack, checkQueueExists } from '../../../utils/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../../utils/validation/voiceChannelValidator';
import { Logger } from 'pino';

class SkipCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = new SlashCommandBuilder()
            .setName('skip')
            .setDescription('Lewati lagu (tracks) berikutnya atau pilih posisi tertentu dalam antrian')
            .addNumberOption((option) =>
                option
                    .setName('nomor')
                    .setDescription('Posisi lagu (tracks) dalam antrian yang ingin dilewati')
                    .setMinValue(1)
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

        const skipToTrackInput: number = interaction.options.getNumber('nomor')!;

        if (skipToTrackInput) {
            return await this.handleSkipToTrack(logger, interaction, queue, skipToTrackInput);
        } else {
            return await this.handleSkipToNextTrack(logger, interaction, queue);
        }
    }

    private async handleSkipToTrack(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        queue: GuildQueue,
        skipToTrack: number
    ) {
        if (skipToTrack > queue.tracks.data.length) {
            return await this.handleTrackNumberHigherThanTotalTracks(skipToTrack, queue, logger, interaction);
        } else {
            const skippedTrack: Track = queue.currentTrack!;
            queue.node.skipTo(skipToTrack - 1);
            logger.debug('Skipped to specified track number.');
            return await this.respondWithSuccessEmbed(skippedTrack, interaction);
        }
    }

    private async handleTrackNumberHigherThanTotalTracks(
        skipToTrack: number,
        queue: GuildQueue,
        logger: Logger,
        interaction: ChatInputCommandInteraction
    ) {
        logger.debug('Specified track number was higher than total tracks.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${this.embedOptions.icons.nyctophileZuiMegaphone} | Oops!** Hanya ada **\`${queue.tracks.data.length}\`** lagu (tracks) dalam antrian. Kamu ngga bisa melewati lagu (tracks) diurutan nomor **\`${skipToTrack}\`**.`
                    )
                    .setColor(this.embedOptions.colors.warning)
            ]
        });
    }

    private async handleSkipToNextTrack(logger: Logger, interaction: ChatInputCommandInteraction, queue: GuildQueue) {
        if (queue.tracks.data.length === 0 && !queue.currentTrack) {
            return await this.handleNoTracksInQueueAndNoCurrentTrack(logger, interaction);
        }

        const skippedTrack: Track = queue.currentTrack!;
        queue.node.skip();
        logger.debug('Skipped current track.');
        return await this.respondWithSuccessEmbed(skippedTrack, interaction);
    }

    private async handleNoTracksInQueueAndNoCurrentTrack(logger: Logger, interaction: ChatInputCommandInteraction) {
        logger.debug('No tracks in queue and no current track.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${this.embedOptions.icons.nyctophileZuiMegaphone} | Oops!** Ngga ada lagu (tracks) yang sedang dimainkan`
                    )
                    .setColor(this.embedOptions.colors.warning)
            ]
        });
    }

    private async respondWithSuccessEmbed(skippedTrack: Track, interaction: ChatInputCommandInteraction) {
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${this.embedOptions.icons.skipped} | Melewati** lagu ${this.getFormattedTrackUrl(
                            skippedTrack
                        )}`
                    )
                    .setColor(this.embedOptions.colors.success)
            ]
        });
    }
}

export default new SkipCommand();
