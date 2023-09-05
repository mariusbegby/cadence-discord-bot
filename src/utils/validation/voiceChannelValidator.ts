import config from 'config';
import { EmbedBuilder, GuildMember, InteractionType } from 'discord.js';
import { Logger } from 'pino';
import { InteractionValidationError } from '../../classes/interactions';
import loggerModule from '../../services/logger';
import { EmbedOptions } from '../../types/configTypes';
import { ValidatorParams } from '../../types/utilTypes';

const embedOptions: EmbedOptions = config.get('embedOptions');
export const checkInVoiceChannel = async ({ interaction, executionId }: ValidatorParams) => {
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
                        `**${embedOptions.icons.warning} Not in a voice channel**\nYou need to be in a voice channel to perform this action.`
                    )
                    .setColor(embedOptions.colors.warning)
            ]
        });

        logger.debug(`User tried to use command '${interactionIdentifier}' but was not in a voice channel.`);
        throw new InteractionValidationError('User not in voice channel.');
    }

    return;
};

export const checkSameVoiceChannel = async ({ interaction, queue, executionId }: ValidatorParams) => {
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
        return;
    }

    if (
        interaction.member instanceof GuildMember &&
        interaction.member.voice.channel?.id !== queue.dispatcher.channel.id
    ) {
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${embedOptions.icons.warning} Not in same voice channel**\nYou need to be in the same voice channel as me to perform this action.\n\n**Voice channel:** <#${queue.dispatcher.channel.id}>`
                    )
                    .setColor(embedOptions.colors.warning)
            ]
        });

        logger.debug(`User tried to use command '${interactionIdentifier}' but was not in the same voice channel.`);
        throw new InteractionValidationError('User not in same voice channel.');
    }

    return;
};
