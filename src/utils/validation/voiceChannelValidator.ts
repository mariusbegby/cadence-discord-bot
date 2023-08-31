import config from 'config';
import { EmbedBuilder, GuildMember, InteractionType } from 'discord.js';

import { Logger } from 'pino';
import loggerModule from '../../services/logger';
import { EmbedOptions } from '../../types/configTypes';
import { NotInSameVoiceChannelParams, NotInVoiceChannelParams } from '../../types/utilTypes';

const embedOptions: EmbedOptions = config.get('embedOptions');
export const notInVoiceChannel = async ({ interaction, executionId }: NotInVoiceChannelParams) => {
    const logger: Logger = loggerModule.child({
        module: 'validator',
        name: 'notInVoiceChannel',
        executionId: executionId,
        shardId: interaction.guild?.shardId,
        guildId: interaction.guild?.id
    });

    const interactionIdentifier =
        interaction.type === InteractionType.ApplicationCommand ? interaction.commandName : interaction.customId;

    if (interaction.member instanceof GuildMember && !interaction.member.voice.channel) {
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${embedOptions.icons.warning} Not in a voice channel**\nYou need to be in a voice channel to use this command.`
                    )
                    .setColor(embedOptions.colors.warning)
            ]
        });

        logger.debug(`User tried to use command '${interactionIdentifier}' but was not in a voice channel.`);
        return true;
    }

    return false;
};

export const notInSameVoiceChannel = async ({ interaction, queue, executionId }: NotInSameVoiceChannelParams) => {
    const logger: Logger = loggerModule.child({
        module: 'utilValidation',
        name: 'notInSameVoiceChannel',
        executionId: executionId,
        shardId: interaction.guild?.shardId,
        guildId: interaction.guild?.id
    });

    const interactionIdentifier =
        interaction.type === InteractionType.ApplicationCommand ? interaction.commandName : interaction.customId;

    if (!queue || !queue.dispatcher) {
        // If there is no queue or bot is not in voice channel, then there is no need to check if user is in same voice channel.
        return false;
    }

    if (
        interaction.member instanceof GuildMember &&
        interaction.member.voice.channel?.id !== queue.dispatcher.channel.id
    ) {
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${embedOptions.icons.warning} Not in same voice channel**\nYou need to be in the same voice channel as me to use this command.\n\n**Voice channel:** ${queue.dispatcher.channel.name}`
                    )
                    .setColor(embedOptions.colors.warning)
            ]
        });

        logger.debug(`User tried to use command '${interactionIdentifier}' but was not in the same voice channel.`);
        return true;
    }

    return false;
};
