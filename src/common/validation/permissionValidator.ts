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
import { InteractionValidationError } from '../classes/interactions';
import { loggerService, Logger } from '../services/logger';
import { EmbedOptions } from '../../types/configTypes';
import { ValidatorParams } from '../../types/utilTypes';
import { useServerTranslator } from '../utils/localeUtil';

const embedOptions: EmbedOptions = config.get('embedOptions');
export const checkVoicePermissionJoinAndTalk = async ({ interaction, executionId }: ValidatorParams) => {
    const logger: Logger = loggerService.child({
        module: 'utilValidation',
        name: 'cannotJoinVoiceOrTalk',
        executionId: executionId,
        shardId: interaction.guild?.shardId,
        guildId: interaction.guild?.id
    });
    const translator = useServerTranslator(interaction);

    const channel: VoiceBasedChannel | null =
        interaction.member instanceof GuildMember ? interaction.member.voice.channel : null;
    const interactionIdentifier =
        interaction.type === InteractionType.ApplicationCommand ? interaction.commandName : interaction.customId;

    if (channel instanceof VoiceChannel && (!channel.joinable || !channel.speakable)) {
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        translator('validation.cannotJoinVoiceOrTalk', {
                            icon: embedOptions.icons.warning,
                            channel: `<#${channel.id}>`
                        })
                    )
                    .setColor(embedOptions.colors.warning)
                    .setFooter({
                        text:
                            interaction.member instanceof GuildMember
                                ? interaction.member.nickname || interaction.user.username
                                : interaction.user.username,
                        iconURL: interaction.user.avatarURL() || embedOptions.info.fallbackIconUrl
                    })
            ],
            ephemeral: true
        });

        logger.debug(
            `User tried to use command '${interactionIdentifier}' but the bot had no permission to join/speak in the voice channel.`
        );
        throw new InteractionValidationError('Bot cannot join or speak in voice channel.');
    }

    return;
};

export const checkChannelPermissionViewable = async ({ interaction, executionId }: ValidatorParams) => {
    const logger: Logger = loggerService.child({
        module: 'utilValidation',
        name: 'cannotSendMessageInChannel',
        executionId: executionId,
        shardId: interaction.guild?.shardId,
        guildId: interaction.guild?.id
    });
    const translator = useServerTranslator(interaction);

    const channel: TextBasedChannel | null = interaction.channel;

    const interactionIdentifier =
        interaction.type === InteractionType.ApplicationCommand ? interaction.commandName : interaction.customId;

    // only checks if channel is viewable, as bot will have permission to send interaction replies if channel is viewable
    if (channel instanceof TextChannel && !channel.viewable) {
        logger.info(
            `User tried to use interaction '${interactionIdentifier}' but the bot has permission to send reply in text channel.`
        );

        try {
            logger.debug(
                'Sending ephemeral message in channel about insufficient permissions to send message in channel.'
            );
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            translator('validation.cannotSendMessageInChannel', {
                                icon: embedOptions.icons.warning,
                                channel: `<#${channel.id}>`
                            })
                        )
                        .setColor(embedOptions.colors.warning)
                        .setFooter({
                            text:
                                interaction.member instanceof GuildMember
                                    ? interaction.member.nickname || interaction.user.username
                                    : interaction.user.username,
                            iconURL: interaction.user.avatarURL() || embedOptions.info.fallbackIconUrl
                        })
                ],
                ephemeral: true
            });
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
