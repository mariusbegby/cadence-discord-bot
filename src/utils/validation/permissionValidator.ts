import config from 'config';
import {
    EmbedBuilder,
    GuildMember,
    InteractionType,
    TextBasedChannel,
    TextChannel,
    VoiceBasedChannel,
    VoiceChannel
} from 'discord.js';
import { Logger } from 'pino';
import { InteractionValidationError } from '../../classes/interactions';
import loggerModule from '../../services/logger';
import { EmbedOptions } from '../../types/configTypes';
import { ValidatorParams } from '../../types/utilTypes';

const embedOptions: EmbedOptions = config.get('embedOptions');
export const checkVoicePermissionJoinAndTalk = async ({ interaction, executionId }: ValidatorParams) => {
    const logger: Logger = loggerModule.child({
        module: 'utilValidation',
        name: 'cannotJoinVoiceOrTalk',
        executionId: executionId,
        shardId: interaction.guild?.shardId,
        guildId: interaction.guild?.id
    });

    const channel: VoiceBasedChannel | null =
        interaction.member instanceof GuildMember ? interaction.member.voice.channel : null;
    const interactionIdentifier =
        interaction.type === InteractionType.ApplicationCommand ? interaction.commandName : interaction.customId;

    if (channel instanceof VoiceChannel && (!channel.joinable || !channel.speakable)) {
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${embedOptions.icons.warning} Oops!**\nI do not have permission to play audio in the voice channel <#${channel.id}>.\n\nPlease make sure I have the **\`Connect\`** and **\`Speak\`** permissions in this voice channel.`
                    )
                    .setColor(embedOptions.colors.warning)
            ]
        });

        logger.debug(
            `User tried to use command '${interactionIdentifier}' but the bot had no permission to join/speak in the voice channel.`
        );
        throw new InteractionValidationError('Bot cannot join or speak in voice channel.');
    }

    return;
};

export const checkChannelPermissionViewable = async ({ interaction, executionId }: ValidatorParams) => {
    const logger: Logger = loggerModule.child({
        module: 'utilValidation',
        name: 'cannotSendMessageInChannel',
        executionId: executionId,
        shardId: interaction.guild?.shardId,
        guildId: interaction.guild?.id
    });

    const channel: TextBasedChannel | null = interaction.channel;

    const interactionIdentifier =
        interaction.type === InteractionType.ApplicationCommand ? interaction.commandName : interaction.customId;

    // only checks if channel is viewable, as bot will have permission to send interaction replies if channel is viewable
    if (channel instanceof TextChannel && !channel.viewable) {
        logger.info(
            `User tried to use interaction '${interactionIdentifier}' but the bot has permission to send reply in text channel.`
        );

        try {
            // we can still send ephemeral replies in channels we can't view, so sending message to user instead
            if (!interaction.deferred && !interaction.replied) {
                logger.debug('Interaction was not deferred or replied to yet. Deferring reply as ephemeral.');
                await interaction.deferReply({ ephemeral: true });

                logger.debug(
                    'Sending ephemeral message in channel about insufficient permissions to send message in channel.'
                );
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(
                                `**${embedOptions.icons.warning} Oops!**\nI do not have permission to send message replies in the channel <#${channel.id}>.\n\nPlease make sure I have the **\`View Channel\`** permission in this text channel.`
                            )
                            .setColor(embedOptions.colors.warning)
                    ]
                });
            }
        } catch (error) {
            if (error instanceof Error) {
                if (error.message == 'The reply to this interaction has already been sent or deferred.') {
                    logger.warn(
                        'Error while sending ephemereal message about insufficient permissions to send message in channel.'
                    );
                    logger.debug(error);
                } else {
                    logger.error(
                        error,
                        'Failed to send ephemeral reply to user in channel that bot cannot view/send message in.'
                    );
                }
            } else {
                logger.debug('Throwing error');
                throw error;
            }
        }

        throw new InteractionValidationError('Bot cannot send message in channel.');
    }

    return;
};
