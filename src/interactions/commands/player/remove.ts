import { GuildQueue, Track, useQueue } from 'discord-player';
import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { BaseSlashCommandInteraction } from '../../../classes/interactions';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../../types/interactionTypes';
import { checkQueueExists } from '../../../utils/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../../utils/validation/voiceChannelValidator';
import { Logger } from 'pino';

class RemoveCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = new SlashCommandBuilder()
            .setName('remove')
            .setDescription('Hapus lagu (tracks) tertentu dari antrian')
            .addNumberOption((option) =>
                option
                    .setName('nomor')
                    .setDescription('Posisi lagu (tracks) yang ingin dihapus dari antrian')
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
            checkQueueExists
        ]);

        const removeTrackNumber: number = interaction.options.getNumber('nomor')!;

        if (removeTrackNumber > queue.tracks.data.length) {
            return await this.handleInvalidTrackNumber(logger, interaction, removeTrackNumber, queue);
        }

        return await this.removeTrackFromQueue(logger, interaction, queue, removeTrackNumber);
    }

    private async handleInvalidTrackNumber(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        removeTrackNumber: number,
        queue: GuildQueue
    ) {
        logger.debug('Specified track number is higher than total tracks.');

        logger.debug('Responding with warning embed.');
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${this.embedOptions.icons.nyctophileZuiMegaphone} | Oops!** **\`${removeTrackNumber}\`** bukan nomor antrian lagu (tracks) yang bener. Pastikan terlebih dahulu, karena ada **\`${queue.tracks.data.length}\`** lagu (tracks) dalam antrian.`
                    )
                    .setColor(this.embedOptions.colors.warning)
            ]
        });
        return Promise.resolve();
    }

    private async removeTrackFromQueue(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        queue: GuildQueue,
        removeTrackNumber: number
    ) {
        const removedTrack: Track = queue.node.remove(removeTrackNumber - 1)!;
        logger.debug(`Removed track '${removedTrack.url}' from queue.`);
        logger.debug('Responding with success embed.');

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${this.embedOptions.icons.nyctophileZuiDisable} | ${this.getFormattedTrackUrl(
                            removedTrack
                        )}** ini telah dihapus dari antrian.`
                    )
                    .setColor(this.embedOptions.colors.success)
            ]
        });
        return Promise.resolve();
    }
}

export default new RemoveCommand();
