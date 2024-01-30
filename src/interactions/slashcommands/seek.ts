import { GuildQueue, useQueue } from 'discord-player';
import { ChatInputCommandInteraction, EmbedBuilder, Message, SlashCommandBuilder } from 'discord.js';
import { BaseSlashCommandInteraction } from '../../common/classes/interactions';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../types/interactionTypes';
import { checkQueueCurrentTrack, checkQueueExists } from '../../common/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../common/validation/voiceChannelValidator';
import { Logger } from 'pino';
import { localizeCommand, useServerTranslator } from '../../common/utils/localeUtil';
import { TFunction } from 'i18next';
import { formatSlashCommand } from '../../common/utils/formattingUtils';

class SeekCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = localizeCommand(
            new SlashCommandBuilder()
                .setName('seek')
                .addStringOption((option) => option.setName('duration').setRequired(true))
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

        await interaction.deferReply();
        logger.debug('Interaction deferred.');

        const durationInputSplit: string[] = interaction.options.getString('duration')!.split(':');
        const formattedDurationString: string = this.parseDurationArray(durationInputSplit);

        if (!this.validateDurationFormat(formattedDurationString)) {
            return await this.handleInvalidDurationFormat(logger, interaction, formattedDurationString, translator);
        }

        const currentTrackMaxDurationInMs: number = queue.currentTrack!.durationMS;
        const inputDurationInMilliseconds: number = this.getDurationInputInMilliseconds(durationInputSplit);

        if (inputDurationInMilliseconds > currentTrackMaxDurationInMs - 1000) {
            return await this.handleDurationLongerThanTrack(
                logger,
                interaction,
                formattedDurationString,
                queue,
                translator
            );
        }

        return await this.seekToDurationInCurrentTrack(
            logger,
            interaction,
            queue,
            inputDurationInMilliseconds,
            formattedDurationString,
            translator
        );
    }

    private async handleInvalidDurationFormat(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        formattedDurationString: string,
        translator: TFunction
    ): Promise<Message> {
        logger.debug('Invalid duration format input.');

        logger.debug('Responding with warning embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        translator('commands.seek.correctFormatInstruction', {
                            icon: this.embedOptions.icons.warning,
                            wrongDuration: formattedDurationString,
                            seekCommand: formatSlashCommand('seek', translator)
                        })
                    )
                    .setColor(this.embedOptions.colors.warning)
            ]
        });
    }

    private async seekToDurationInCurrentTrack(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        queue: GuildQueue,
        durationInMilliseconds: number,
        formattedDurationString: string,
        translator: TFunction
    ): Promise<Message> {
        queue.node.seek(durationInMilliseconds);
        logger.debug(`Seeked to '${formattedDurationString}' in current track.`);

        logger.debug('Responding with success embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(await this.getEmbedUserAuthor(interaction))
                    .setDescription(
                        translator('commands.seek.seekingToTimestamp', {
                            icon: this.embedOptions.icons.success,
                            duration: formattedDurationString
                        })
                    )
                    .setThumbnail(this.getTrackThumbnailUrl(queue.currentTrack!))
                    .setColor(this.embedOptions.colors.success)
            ]
        });
    }

    private async handleDurationLongerThanTrack(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        formattedDurationString: string,
        queue: GuildQueue,
        translator: TFunction
    ): Promise<Message> {
        logger.debug('Duration specified is longer than the track duration.');

        logger.debug('Responding with warning embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        translator('commands.seek.durationLongerThanTrackDuration', {
                            icon: this.embedOptions.icons.warning,
                            wrongDuration: formattedDurationString,
                            trackDuration: queue.currentTrack!.duration
                        })
                    )
                    .setColor(this.embedOptions.colors.warning)
            ]
        });
    }

    private parseDurationArray(durationInputSplit: string[]): string {
        switch (durationInputSplit.length) {
            case 1:
                durationInputSplit.unshift('00', '00');
                break;
            case 2:
                durationInputSplit.unshift('00');
                break;
            default:
                break;
        }

        durationInputSplit = durationInputSplit.map((value) => {
            return value.padStart(2, '0');
        });

        return durationInputSplit.join(':');
    }

    private validateDurationFormat(formattedDurationString: string): boolean {
        const formattedDurationSplit: string[] = formattedDurationString.split(':');
        if (formattedDurationSplit.length === 0 || formattedDurationSplit.length > 3) {
            return false;
        }

        if (!formattedDurationSplit.every((value) => value.length === 2)) {
            return false;
        }

        const regex: RegExp = new RegExp('([0-1][0-9]|2[0-3]):?[0-5][0-9]:?[0-5][0-9]');
        const isValidDuration: boolean = regex.test(formattedDurationString);
        return isValidDuration;
    }

    private getDurationInputInMilliseconds(durationInputSplit: string[]): number {
        const durationInMilliseconds =
            Number(durationInputSplit[0]) * 3600000 +
            Number(durationInputSplit[1]) * 60000 +
            Number(durationInputSplit[2]) * 1000;

        return durationInMilliseconds;
    }
}

export default new SeekCommand();
