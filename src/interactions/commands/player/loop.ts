import { GuildQueue, QueueRepeatMode, useQueue } from 'discord-player';
import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    Message,
    SlashCommandBuilder,
    SlashCommandNumberOption
} from 'discord.js';
import { Logger } from 'pino';
import { BaseSlashCommandInteraction } from '../../../classes/interactions';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../../types/interactionTypes';
import { checkQueueExists } from '../../../utils/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../../utils/validation/voiceChannelValidator';

class LoopCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = new SlashCommandBuilder()
            .setName('loop')
            .setDescription('Toggle looping a track, the whole queue or autoplay.')
            .addNumberOption(() =>
                new SlashCommandNumberOption()
                    .setName('mode')
                    .setDescription('Loop mode: Track, queue, autoplay or disabled.')
                    .setRequired(false)
                    .addChoices(
                        { name: 'Track', value: QueueRepeatMode.TRACK },
                        { name: 'Queue', value: QueueRepeatMode.QUEUE },
                        { name: 'Autoplay', value: QueueRepeatMode.AUTOPLAY },
                        { name: 'Disabled', value: QueueRepeatMode.OFF }
                    )
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

        const userInputRepeatMode: QueueRepeatMode = interaction.options.getNumber('mode')!;
        const currentRepeatMode: QueueRepeatMode = queue.repeatMode;

        if (!userInputRepeatMode && userInputRepeatMode !== 0) {
            return await this.handleNoInputMode(logger, interaction, currentRepeatMode);
        }

        if (userInputRepeatMode === currentRepeatMode) {
            return await this.handleSameMode(logger, interaction, userInputRepeatMode);
        }

        return await this.handleChangeMode(logger, interaction, queue, currentRepeatMode, userInputRepeatMode);
    }

    private async handleNoInputMode(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        currentRepeatMode: QueueRepeatMode
    ): Promise<Message> {
        logger.debug('No repeat mode was provided, responding with current repeat mode.');

        const repeatModeEmbedIcon =
            currentRepeatMode === 3 ? this.embedOptions.icons.autoplay : this.embedOptions.icons.loop;
        const repeatModeEmbedName = this.getRepeatModeEmbedName(currentRepeatMode);

        logger.debug('Responding with info embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${repeatModeEmbedIcon} Current loop mode**\n` +
                            `The looping mode is currently set to **\`${repeatModeEmbedName}\`**.`
                    )
                    .setColor(this.embedOptions.colors.info)
            ]
        });
    }

    private async handleSameMode(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        currentRepeatMode: QueueRepeatMode
    ): Promise<Message> {
        const repeatModeEmbedName = this.getRepeatModeEmbedName(currentRepeatMode);
        logger.debug(`Loop mode is already set to '${repeatModeEmbedName}'.`);
        logger.debug('Responding with warning embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${this.embedOptions.icons.warning} Oops!**\n` +
                            `Loop mode is already **\`${repeatModeEmbedName}\`**.`
                    )
                    .setColor(this.embedOptions.colors.warning)
            ]
        });
    }

    private async handleChangeMode(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        queue: GuildQueue,
        fromRepeatMode: QueueRepeatMode,
        toRepeatMode: QueueRepeatMode
    ): Promise<Message> {
        const newRepeatModeEmbedName = this.getRepeatModeEmbedName(toRepeatMode);
        const getChangedRepeatModeEmbedReply = this.getChangedRepeatModeEmbedReply(fromRepeatMode, toRepeatMode);

        queue.setRepeatMode(toRepeatMode);
        logger.debug(`Loop mode changed to '${newRepeatModeEmbedName}'.`);

        logger.debug('Responding with success embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(this.getEmbedUserAuthor(interaction))
                    .setDescription(getChangedRepeatModeEmbedReply)
                    .setColor(this.embedOptions.colors.success)
            ]
        });
    }

    private getRepeatModeEmbedName(repeatMode: QueueRepeatMode): string {
        const repeatModeEmbedString: { [key in QueueRepeatMode]: string } = {
            [QueueRepeatMode.OFF]: 'disabled',
            [QueueRepeatMode.TRACK]: 'track',
            [QueueRepeatMode.QUEUE]: 'queue',
            [QueueRepeatMode.AUTOPLAY]: 'autoplay'
        };

        return repeatModeEmbedString[repeatMode];
    }

    private getChangedRepeatModeEmbedReply(fromRepeatMode: QueueRepeatMode, toRepeatMode: QueueRepeatMode): string {
        const fromRepeatModeEmbedName = this.getRepeatModeEmbedName(fromRepeatMode);
        const toRepeatModeEmbedName = this.getRepeatModeEmbedName(toRepeatMode);

        let repeatModeIcon = this.embedOptions.icons.looping;
        let newRepeatModeMessage = `The ${toRepeatModeEmbedName} will now play on repeat!`;

        if (toRepeatMode === QueueRepeatMode.OFF) {
            repeatModeIcon = this.embedOptions.icons.success;
            newRepeatModeMessage = `The ${fromRepeatModeEmbedName} will no longer play on repeat!`;
        } else if (toRepeatMode === QueueRepeatMode.AUTOPLAY) {
            repeatModeIcon = this.embedOptions.icons.autoplaying;
            newRepeatModeMessage = 'When the queue is empty, similar tracks will start playing!';
        }

        return (
            `**${repeatModeIcon} Loop mode changed**\n` +
            `Changing loop mode from **\`${fromRepeatModeEmbedName}\`** to **\`${toRepeatModeEmbedName}\`**.\n\n` +
            newRepeatModeMessage
        );
    }
}

export default new LoopCommand();
