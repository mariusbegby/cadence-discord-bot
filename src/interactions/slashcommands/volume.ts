import { type GuildQueue, useQueue } from 'discord-player';
import { type ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { BaseSlashCommandInteraction } from '../../common/classes/interactions';
import type { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../types/interactionTypes';
import { checkQueueExists } from '../../common/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../common/validation/voiceChannelValidator';
import type { Logger } from '../../common/services/logger';
import { localizeCommand, useServerTranslator, type Translator } from '../../common/utils/localeUtil';

class VolumeCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = localizeCommand(
            new SlashCommandBuilder()
                .setName('volume')
                .addIntegerOption((option) => option.setName('percentage').setMinValue(0).setMaxValue(100))
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
            checkQueueExists
        ]);

        await interaction.deferReply();
        logger.debug('Interaction deferred.');

        const volume: number = interaction.options.getInteger('percentage')!;

        if (!volume && volume !== 0) {
            return await this.handleShowCurrentVolume(queue, logger, interaction, translator);
        }
        return await this.handleValidVolumeInput(volume, queue, logger, interaction, translator);
    }

    private async handleShowCurrentVolume(
        queue: GuildQueue,
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        translator: Translator
    ) {
        const currentVolume: number = queue.node.volume;
        logger.debug('No volume input was provided, showing current volume.');

        const currentVolumeIcon =
            currentVolume === 0 ? this.embedOptions.icons.volumeIsMuted : this.embedOptions.icons.volume;

        logger.debug('Responding with info embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        translator('commands.volume.volumeInformation', {
                            icon: currentVolumeIcon,
                            volume: currentVolume
                        })
                    )
                    .setColor(this.embedOptions.colors.info)
            ]
        });
    }

    private async handleValidVolumeInput(
        volume: number,
        queue: GuildQueue,
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        translator: Translator
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
                            translator('commands.volume.volumeMuted', {
                                icon: this.embedOptions.icons.volumeMuted
                            })
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
                        translator('commands.volume.volumeChanged', {
                            icon: this.embedOptions.icons.volumeChanged,
                            volume
                        })
                    )
                    .setColor(this.embedOptions.colors.success)
            ]
        });
    }
}

export default new VolumeCommand();
