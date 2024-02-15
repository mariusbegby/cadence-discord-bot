import config from 'config';
import { EmbedBuilder, GuildMember, InteractionType } from 'discord.js';
import { InteractionValidationError } from '../classes/interactions';
import { loggerService, Logger } from '../services/logger';
import { EmbedOptions } from '../../types/configTypes';
import { ValidatorParams } from '../../types/utilTypes';
import { useServerTranslator } from '../utils/localeUtil';
import { formatSlashCommand } from '../utils/formattingUtils';

const embedOptions: EmbedOptions = config.get('embedOptions');
export const checkQueueExists = async ({ interaction, queue, executionId }: ValidatorParams) => {
    const logger: Logger = loggerService.child({
        module: 'utilValidation',
        name: 'queueDoesNotExist',
        executionId: executionId,
        shardId: interaction.guild?.shardId,
        guildId: interaction.guild?.id
    });
    const translator = useServerTranslator(interaction);

    const interactionIdentifier =
        interaction.type === InteractionType.ApplicationCommand ? interaction.commandName : interaction.customId;

    if (!queue) {
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        translator('validation.queueDoesNotExist', {
                            icon: embedOptions.icons.warning,
                            playCommand: formatSlashCommand('play', translator)
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

        logger.debug(`User tried to use command '${interactionIdentifier}' but there was no queue.`);
        throw new InteractionValidationError('Queue does not exist.');
    }

    return;
};

export const checkHistoryExists = async ({ interaction, history, executionId }: ValidatorParams) => {
    const logger: Logger = loggerService.child({
        module: 'utilValidation',
        name: 'historyDoesNotExist',
        executionId: executionId,
        shardId: interaction.guild?.shardId,
        guildId: interaction.guild?.id
    });
    const translator = useServerTranslator(interaction);

    const interactionIdentifier =
        interaction.type === InteractionType.ApplicationCommand ? interaction.commandName : interaction.customId;

    if (!history) {
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        translator('validation.historyDoesNotExist', {
                            icon: embedOptions.icons.warning,
                            playCommand: formatSlashCommand('play', translator)
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

        logger.debug(`User tried to use command '${interactionIdentifier}' but there was no history.`);
        throw new InteractionValidationError('History does not exist.');
    }

    return;
};

export const checkQueueCurrentTrack = async ({ interaction, queue, executionId }: ValidatorParams) => {
    const logger: Logger = loggerService.child({
        module: 'utilValidation',
        name: 'queueNoCurrentTrack',
        executionId: executionId,
        shardId: interaction.guild?.shardId,
        guildId: interaction.guild?.id
    });
    const translator = useServerTranslator(interaction);

    const interactionIdentifier =
        interaction.type === InteractionType.ApplicationCommand ? interaction.commandName : interaction.customId;

    if (queue && !queue.currentTrack) {
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        translator('validation.queueNoCurrentTrack', {
                            icon: embedOptions.icons.warning,
                            playCommand: formatSlashCommand('play', translator)
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

        logger.debug(`User tried to use command '${interactionIdentifier}' but there was no current track.`);
        throw new InteractionValidationError('Queue has no current track.');
    }

    return;
};

export const checkQueueEmpty = async ({ interaction, queue, executionId }: ValidatorParams) => {
    const logger: Logger = loggerService.child({
        module: 'utilValidation',
        name: 'queueIsEmpty',
        executionId: executionId,
        shardId: interaction.guild?.shardId,
        guildId: interaction.guild?.id
    });
    const translator = useServerTranslator(interaction);

    const interactionIdentifier =
        interaction.type === InteractionType.ApplicationCommand ? interaction.commandName : interaction.customId;

    if (queue && queue.tracks.data.length === 0) {
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        translator('validation.queueIsEmpty', {
                            icon: embedOptions.icons.warning,
                            playCommand: formatSlashCommand('play', translator)
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

        logger.debug(`User tried to use command '${interactionIdentifier}' but there was no tracks in the queue.`);
        throw new InteractionValidationError('Queue is empty.');
    }

    return;
};
