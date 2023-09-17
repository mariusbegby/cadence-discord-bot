import { GuildQueue, useMainPlayer, useQueue } from 'discord-player';
import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, Message, SlashCommandBuilder } from 'discord.js';
import { BaseSlashCommandInteraction } from '../../../classes/interactions';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../../types/interactionTypes';
import { checkInVoiceChannel } from '../../../utils/validation/voiceChannelValidator';
import { checkVoicePermissionJoinAndTalk } from '../../../utils/validation/permissionValidator';
import { Logger } from 'pino';

class JoinCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = new SlashCommandBuilder()
            .setName('join')
            .setDescription('The bot will join the voice channel if not already in one.');
        super(data);
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, interaction } = params;
        const logger = this.getLogger(this.name, executionId, interaction);

        await this.runValidators({ interaction, executionId }, [checkInVoiceChannel, checkVoicePermissionJoinAndTalk]);

        const existingQueue = useQueue(interaction.guild!.id);

        if (existingQueue) {
            return await this.handleExisitingQueue(interaction, existingQueue);
        }

        const queue = this.createQueue(interaction);
        if (!queue) {
            return await this.handleCouldNotConnect(interaction);
        }

        await this.connectToVoiceChannel(logger, queue, interaction);
        if (!queue.dispatcher) {
            return await this.handleCouldNotConnect(interaction);
        }

        logger.debug('Responding with success embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(this.getEmbedUserAuthor(interaction))
                    .setDescription(
                        `**${this.embedOptions.icons.success} Joined channel**\n` +
                            `Connected to voice channel: <#${queue.dispatcher.channel.id}>\n\n` +
                            'To add tracks, use the **`/play`** command!'
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

    private async handleCouldNotConnect(interaction: ChatInputCommandInteraction): Promise<Message> {
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(this.getEmbedUserAuthor(interaction))
                    .setDescription(
                        `**${this.embedOptions.icons.warning} Oops!**\n` +
                            'Could not join voice channel, please try again.'
                    )
                    .setColor(this.embedOptions.colors.warning)
            ]
        });
    }

    private async handleExisitingQueue(interaction: ChatInputCommandInteraction, queue: GuildQueue): Promise<Message> {
        const connectedChannel = queue.dispatcher?.channel;
        const channelMention = connectedChannel?.id ? `<#${connectedChannel.id}>` : 'Unknown';

        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(this.getEmbedUserAuthor(interaction))
                    .setDescription(
                        `**${this.embedOptions.icons.warning} Oops!**\n` +
                            `I am already connected to voice channel ${channelMention}.\n\n` +
                            'To disconnect me from the channel, use the **`/leave`** command.'
                    )
                    .setColor(this.embedOptions.colors.warning)
            ]
        });
    }
}

export default new JoinCommand();
