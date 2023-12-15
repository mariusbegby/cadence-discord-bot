import { GuildQueue, QueueRepeatMode, useQueue } from 'discord-player';
import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    Message,
    SlashCommandBuilder,
    SlashCommandIntegerOption
} from 'discord.js';
import { Logger } from 'pino';
import { BaseSlashCommandInteraction } from '../../../classes/interactions';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../../types/interactionTypes';
import { checkQueueExists } from '../../../utils/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../../utils/validation/voiceChannelValidator';
import { localizeCommand, useServerTranslator } from '../../../common/localeUtil';
import { TFunction } from 'i18next';

class LoopCommand extends BaseSlashCommandInteraction {
    constructor() {
        // TODO: Add choice localization support
        const data = localizeCommand(
            new SlashCommandBuilder()
                .setName('loop')
                .addIntegerOption(() =>
                    new SlashCommandIntegerOption()
                        .setName('mode')
                        .setRequired(false)
                        .addChoices(
                            { name: 'Track', value: QueueRepeatMode.TRACK },
                            { name: 'Queue', value: QueueRepeatMode.QUEUE },
                            { name: 'Autoplay', value: QueueRepeatMode.AUTOPLAY },
                            { name: 'Disabled', value: QueueRepeatMode.OFF }
                        )
                )
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

        const userInputRepeatMode: QueueRepeatMode = interaction.options.getInteger('mode')!;
        const currentRepeatMode: QueueRepeatMode = queue.repeatMode;

        if (!userInputRepeatMode && userInputRepeatMode !== 0) {
            return await this.handleNoInputMode(logger, interaction, currentRepeatMode, translator);
        }

        if (userInputRepeatMode === currentRepeatMode) {
            return await this.handleSameMode(logger, interaction, userInputRepeatMode, translator);
        }

        return await this.handleChangeMode(
            logger,
            interaction,
            queue,
            currentRepeatMode,
            userInputRepeatMode,
            translator
        );
    }

    private async handleNoInputMode(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        currentRepeatMode: QueueRepeatMode,
        translator: TFunction
    ): Promise<Message> {
        logger.debug('No repeat mode was provided, responding with current repeat mode.');

        const repeatModeEmbedIcon =
            currentRepeatMode === 3 ? this.embedOptions.icons.autoplay : this.embedOptions.icons.loop;
        const repeatModeEmbedName = this.getRepeatModeEmbedName(currentRepeatMode, translator);

        logger.debug('Responding with info embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        translator('commands.loop.loopModeInformation', {
                            icon: repeatModeEmbedIcon,
                            mode: repeatModeEmbedName
                        })
                    )
                    .setColor(this.embedOptions.colors.info)
            ]
        });
    }

    private async handleSameMode(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        currentRepeatMode: QueueRepeatMode,
        translator: TFunction
    ): Promise<Message> {
        const repeatModeEmbedName = this.getRepeatModeEmbedName(currentRepeatMode, translator);
        logger.debug(`Loop mode is already set to '${repeatModeEmbedName}'.`);
        logger.debug('Responding with warning embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        translator('commands.loop.alreadySet', {
                            icon: this.embedOptions.icons.warning,
                            mode: repeatModeEmbedName
                        })
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
        toRepeatMode: QueueRepeatMode,
        translator: TFunction
    ): Promise<Message> {
        const newRepeatModeEmbedName = this.getRepeatModeEmbedName(toRepeatMode, translator);
        const getChangedRepeatModeEmbedReply = this.getChangedRepeatModeEmbedReply(
            fromRepeatMode,
            toRepeatMode,
            translator
        );

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

    private getRepeatModeEmbedName(repeatMode: QueueRepeatMode, translator: TFunction): string {
        const repeatModeEmbedString: { [key in QueueRepeatMode]: string } = {
            [QueueRepeatMode.OFF]: translator('commands.loop.repeatMode.off'),
            [QueueRepeatMode.TRACK]: translator('commands.loop.repeatMode.track'),
            [QueueRepeatMode.QUEUE]: translator('commands.loop.repeatMode.queue'),
            [QueueRepeatMode.AUTOPLAY]: translator('commands.loop.repeatMode.autoplay')
        };

        return repeatModeEmbedString[repeatMode];
    }

    private getChangedRepeatModeEmbedReply(
        fromRepeatMode: QueueRepeatMode,
        toRepeatMode: QueueRepeatMode,
        translator: TFunction
    ): string {
        const fromRepeatModeEmbedName = this.getRepeatModeEmbedName(fromRepeatMode, translator);
        const toRepeatModeEmbedName = this.getRepeatModeEmbedName(toRepeatMode, translator);

        let repeatModeIcon = this.embedOptions.icons.looping;
        let newRepeatModeMessage: string = translator('commands.loop.willNowPlay', {
            mode: toRepeatModeEmbedName
        });

        if (toRepeatMode === QueueRepeatMode.OFF) {
            repeatModeIcon = this.embedOptions.icons.success;
            newRepeatModeMessage = translator('commands.loop.willNoLongerPlay', {
                mode: fromRepeatModeEmbedName
            });
        } else if (toRepeatMode === QueueRepeatMode.AUTOPLAY) {
            repeatModeIcon = this.embedOptions.icons.autoplaying;
            newRepeatModeMessage = translator('commands.loop.willAutoplay');
        }

        return (
            translator('commands.loop.modeChanged', {
                icon: repeatModeIcon,
                fromName: fromRepeatModeEmbedName,
                toName: toRepeatModeEmbedName
            }) +
            '\n' +
            '\n' +
            newRepeatModeMessage
        );
    }
}

export default new LoopCommand();
