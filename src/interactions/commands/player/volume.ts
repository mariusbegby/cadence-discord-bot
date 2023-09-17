import { GuildQueue, useQueue } from 'discord-player';
import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { BaseSlashCommandInteraction } from '../../../classes/interactions';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../../types/interactionTypes';
import { checkQueueExists } from '../../../utils/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../../utils/validation/voiceChannelValidator';
import { Logger } from 'pino';

class VolumeCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = new SlashCommandBuilder()
            .setName('volume')
            .setDescription('Menampilkan atau memodifikasi volume lagu (tracks) yang sedang diputar')
            .addNumberOption((option) =>
                option
                    .setName('persentase')
                    .setDescription('Persentase volume: dari 1% ke 100%')
                    .setMinValue(0)
                    .setMaxValue(100)
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

        const volume: number = interaction.options.getNumber('persentase')!;

        if (!volume && volume !== 0) {
            return await this.handleShowCurrentVolume(queue, logger, interaction);
        } else if (volume > 100 || volume < 0) {
            return await this.handleInvalidVolumeInput(volume, logger, interaction);
        } else {
            return await this.handleValidVolumeInput(volume, queue, logger, interaction);
        }
    }

    private async handleShowCurrentVolume(queue: GuildQueue, logger: Logger, interaction: ChatInputCommandInteraction) {
        const currentVolume: number = queue.node.volume;
        logger.debug('No volume input was provided, showing current volume.');

        const currentVolumeIcon =
            currentVolume === 0 ? this.embedOptions.icons.volumeIsMuted : this.embedOptions.icons.volume;

        logger.debug('Responding with info embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**${currentVolumeIcon} | Volume** saat ini **\`${currentVolume}%\`**.`)
                    .setColor(this.embedOptions.colors.info)
            ]
        });
    }

    private async handleInvalidVolumeInput(volume: number, logger: Logger, interaction: ChatInputCommandInteraction) {
        logger.debug('Volume specified was higher than 100% or lower than 0%.');

        logger.debug('Responding with warning embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${this.embedOptions.icons.nyctophileZuiMegaphone} Oops!** Kamu ngga bisa mengatur volume ke **\`${volume}%\`**, silahkan pilih nomor antara **\`1%\`** dan **\`100%\`**.`
                    )
                    .setColor(this.embedOptions.colors.warning)
            ]
        });
    }

    private async handleValidVolumeInput(
        volume: number,
        queue: GuildQueue,
        logger: Logger,
        interaction: ChatInputCommandInteraction
    ) {
        queue.node.setVolume(volume);
        logger.debug(`Set volume to ${volume}%.`);

        if (volume === 0) {
            logger.debug('Responding with success embed.');
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${this.embedOptions.icons.volumeMuted} | Aku** di bisukan karena volume diatur ke **\`${volume}%\`**.`
                        )
                        .setColor(this.embedOptions.colors.success)
                ]
            });
        }

        logger.debug('Responding with success embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${this.embedOptions.icons.volumeChanged} | Volume** di modifikasi menjadi **\`${volume}%\`**`
                    )
                    .setColor(this.embedOptions.colors.success)
            ]
        });
    }
}

export default new VolumeCommand();
