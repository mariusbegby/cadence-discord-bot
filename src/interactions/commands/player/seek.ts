import { GuildQueue, useQueue } from 'discord-player';
import { ChatInputCommandInteraction, EmbedBuilder, Message, SlashCommandBuilder } from 'discord.js';
import { BaseSlashCommandInteraction } from '../../../classes/interactions';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../../types/interactionTypes';
import { checkQueueCurrentTrack, checkQueueExists } from '../../../utils/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../../utils/validation/voiceChannelValidator';
import { Logger } from 'pino';

class SeekCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = new SlashCommandBuilder()
            .setName('seek')
            .setDescription('Seek to a duration in the current track.')
            .addStringOption((option) =>
                option.setName('duration').setDescription('Duration in format 00:00:00 (HH:mm:ss).').setRequired(true)
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

        const durationInputSplit: string[] = interaction.options.getString('duration')!.split(':');
        const formattedDurationString: string = this.parseDurationArray(durationInputSplit);

        if (!this.validateDurationFormat(formattedDurationString)) {
            return await this.handleInvalidDurationFormat(logger, interaction, formattedDurationString);
        }

        const currentTrackMaxDurationInMs: number = queue.currentTrack!.durationMS;
        const inputDurationInMilliseconds: number = this.getDurationInputInMilliseconds(durationInputSplit);

        if (inputDurationInMilliseconds > currentTrackMaxDurationInMs - 1000) {
            return await this.handleDurationLongerThanTrack(logger, interaction, formattedDurationString, queue);
        }

        return await this.seekToDurationInCurrentTrack(
            logger,
            interaction,
            queue,
            inputDurationInMilliseconds,
            formattedDurationString
        );
    }

    private async handleInvalidDurationFormat(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        formattedDurationString: string
    ): Promise<Message> {
        logger.debug('Invalid duration format input.');

        logger.debug('Responding with warning embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${this.embedOptions.icons.warning} Oops!**\n` +
                            `You entered an invalid duration format, **\`${formattedDurationString}\`**.\n` +
                            'Please use the format **`HH:mm:ss`**, **`mm:ss`** or **`ss`**.\n\n' +
                            '**Examples:**\n' +
                            '- **`/seek`** **`1:24:12`** - Seek to 1 hour, 24 minutes and 12 seconds.\n' +
                            '- **`/seek`** **`3:27`** - Seek to 3 minutes and 27 seconds.\n' +
                            '- **`/seek`** **`42`** - Seek to 42 seconds.'
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
        formattedDurationString: string
    ): Promise<Message> {
        queue.node.seek(durationInMilliseconds);
        logger.debug(`Seeked to '${formattedDurationString}' in current track.`);

        logger.debug('Responding with success embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(await this.getEmbedUserAuthor(interaction))
                    .setDescription(
                        `**${this.embedOptions.icons.success} Seeking to duration**\n` +
                            `Seeking to **\`${formattedDurationString}\`** in current track.`
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
        queue: GuildQueue
    ): Promise<Message> {
        logger.debug('Duration specified is longer than the track duration.');

        logger.debug('Responding with warning embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${this.embedOptions.icons.warning} Oops!**\n` +
                            `You entered **\`${formattedDurationString}\`**, which is a duration that is longer than the duration for the current track.\n\n` +
                            `Please try a duration that is less than the duration of the track (**\`${
                                queue.currentTrack!.duration
                            }\`**).`
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
