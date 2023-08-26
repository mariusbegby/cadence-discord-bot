import config from 'config';
import { EmbedOptions } from '../../types/configTypes';
const embedOptions: EmbedOptions = config.get('embedOptions');
import { EmbedBuilder, GuildMember, VoiceChannel, TextChannel } from 'discord.js';
import loggerModule from '../../services/logger';
import { CannotJoinVoiceOrTalkParams, CannotSendMessageInChannelParams } from '../../types/utilTypes';

export const cannotJoinVoiceOrTalk = async ({ interaction, executionId }: CannotJoinVoiceOrTalkParams) => {
    const logger = loggerModule.child({
        source: 'permissionValidator.js',
        module: 'utilValidation',
        name: 'cannotJoinVoiceOrTalk',
        executionId: executionId,
        shardId: interaction.guild?.shardId,
        guildId: interaction.guild?.id
    });

    const channel = interaction.member instanceof GuildMember ? interaction.member.voice.channel : null;

    if (channel instanceof VoiceChannel && (!channel.joinable || !channel.speakable)) {
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${embedOptions.icons.warning} Oops!**\nI do not have permission to play audio in the voice channel you are in.\n\nPlease make sure I have the **\`Connect\`** and **\`Speak\`** permissions in this voice channel.`
                    )
                    .setColor(embedOptions.colors.warning)
            ]
        });

        logger.debug(
            `User tried to use command '${interaction.commandName}' but the bot had no permission to join/speak in the voice channel.`
        );
        return true;
    }

    return false;
};

export const cannotSendMessageInChannel = async ({ interaction, executionId }: CannotSendMessageInChannelParams) => {
    const logger = loggerModule.child({
        source: 'permissionValidator.js',
        module: 'utilValidation',
        name: 'cannotSendMessageInChannel',
        executionId: executionId,
        shardId: interaction.guild?.shardId,
        guildId: interaction.guild?.id
    });

    const channel = interaction.channel;

    // only checks if channel is viewable, as bot will have permission to send interaction replies if channel is viewable
    if (channel instanceof TextChannel && !channel.viewable) {
        logger.info(
            `User tried to use command '${interaction.commandName}' but the bot had no permission to send reply in text channel.`
        );

        try {
            // we can still send ephemeral replies in channels we can't view, so sending message to user instead
            if (!interaction.deferred && !interaction.replied) {
                await interaction.deferReply({ ephemeral: true });
            }
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${embedOptions.icons.warning} Oops!**\nI do not have permission to send message replies in the channel you are in.\n\nPlease make sure I have the **\`View Channel\`** permission in this text channel.`
                        )
                        .setColor(embedOptions.colors.warning)
                ]
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
                throw error;
            }
        }

        return true;
    }

    return false;
};
