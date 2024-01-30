import { GuildQueue, useMainPlayer, useQueue } from 'discord-player';
import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, Message, SlashCommandBuilder } from 'discord.js';
import { BaseSlashCommandInteraction } from '../../common/classes/interactions';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../types/interactionTypes';
import { checkInVoiceChannel } from '../../common/validation/voiceChannelValidator';
import { checkVoicePermissionJoinAndTalk } from '../../common/validation/permissionValidator';
import { Logger } from 'pino';
import { localizeCommand, useServerTranslator } from '../../common/utils/localeUtil';
import { formatSlashCommand } from '../../common/utils/formattingUtils';
import { TFunction } from 'i18next';

class JoinCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = localizeCommand(new SlashCommandBuilder().setName('join'));
        super(data);
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, interaction } = params;
        const logger = this.getLogger(this.name, executionId, interaction);
        const translator = useServerTranslator(interaction);

        await this.runValidators({ interaction, executionId }, [checkInVoiceChannel, checkVoicePermissionJoinAndTalk]);

        await interaction.deferReply();
        logger.debug('Interaction deferred.');

        const existingQueue = useQueue(interaction.guild!.id);

        if (existingQueue) {
            return await this.handleExisitingQueue(interaction, existingQueue, translator);
        }

        const queue = this.createQueue(interaction);
        if (!queue) {
            return await this.handleCouldNotConnect(interaction, translator);
        }

        await this.connectToVoiceChannel(logger, queue, interaction);
        if (!queue.dispatcher) {
            return await this.handleCouldNotConnect(interaction, translator);
        }

        logger.debug('Responding with success embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(this.getEmbedUserAuthor(interaction))
                    .setDescription(
                        translator('commands.join.joinedChannel', {
                            icon: this.embedOptions.icons.success,
                            channel: `<#${queue.dispatcher.channel.id}>`,
                            playCommand: formatSlashCommand('play', translator)
                        })
                    )
                    .setColor(this.embedOptions.colors.success)
            ]
        });
    }

    private createQueue(interaction: ChatInputCommandInteraction): GuildQueue | undefined {
        try {
            const player = useMainPlayer();
            const createdQueue = player?.queues.create(interaction.guild!.id, {
                ...this.playerOptions,
                maxSize: this.playerOptions.maxQueueSize,
                volume: this.playerOptions.defaultVolume,
                metadata: {
                    channel: interaction.channel,
                    client: interaction.client
                }
            });
            return createdQueue;
        } catch {
            return undefined;
        }
    }

    private async connectToVoiceChannel(
        logger: Logger,
        queue: GuildQueue,
        interaction: ChatInputCommandInteraction
    ): Promise<void> {
        try {
            logger.debug('Connecting to channel.');
            const channel = (interaction.member! as GuildMember).voice.channel!;
            await queue.connect(channel);
        } catch {
            return undefined;
        }
    }

    private async handleCouldNotConnect(
        interaction: ChatInputCommandInteraction,
        translator: TFunction
    ): Promise<Message> {
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(this.getEmbedUserAuthor(interaction))
                    .setDescription(
                        translator('commands.join.couldNotJoin', {
                            icon: this.embedOptions.icons.warning
                        })
                    )
                    .setColor(this.embedOptions.colors.warning)
            ]
        });
    }

    private async handleExisitingQueue(
        interaction: ChatInputCommandInteraction,
        queue: GuildQueue,
        translator: TFunction
    ): Promise<Message> {
        const connectedChannel = queue.dispatcher?.channel;
        const channelMention = connectedChannel?.id ? `<#${connectedChannel.id}>` : '<#0>';

        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(this.getEmbedUserAuthor(interaction))
                    .setDescription(
                        translator('commands.join.alreadyConnected', {
                            icon: this.embedOptions.icons.warning,
                            channel: channelMention,
                            leaveCommand: formatSlashCommand('leave', translator)
                        })
                    )
                    .setColor(this.embedOptions.colors.warning)
            ]
        });
    }
}

export default new JoinCommand();
