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
            .setDescription('Show or change the playback volume for tracks.')
            .addNumberOption((option) =>
                option
                    .setName('percentage')
                    .setDescription('Volume percentage: From 1% to 100%.')
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

        const volume: number = interaction.options.getNumber('percentage')!;

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
                    .setDescription(
                        `**${currentVolumeIcon} Playback volume**\n` +
                            `The playback volume is currently set to **\`${currentVolume}%\`**.`
                    )
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
                        `**${this.embedOptions.icons.warning} Oops!**\n` +
                            `You cannot set the volume to **\`${volume}%\`**, please pick a value betwen **\`1%\`** and **\`100%\`**.`
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
                        .setAuthor(this.getEmbedUserAuthor(interaction))
                        .setDescription(
                            `**${this.embedOptions.icons.volumeMuted} Audio muted**\n` +
                                `Playback audio has been muted, because volume was set to **\`${volume}%\`**.`
                        )
                        .setColor(this.embedOptions.colors.success)
                ]
            });
        }

        logger.debug('Responding with success embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(this.getEmbedUserAuthor(interaction))
                    .setDescription(
                        `**${this.embedOptions.icons.volumeChanged} Volume changed**\n` +
                            `Playback volume has been changed to **\`${volume}%\`**.`
                    )
                    .setColor(this.embedOptions.colors.success)
            ]
        });
    }
}

export default new VolumeCommand();
