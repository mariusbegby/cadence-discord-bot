import config from 'config';
import { EmbedBuilder, InteractionType } from 'discord.js';
import { Logger } from 'pino';
import { InteractionValidationError } from '../../classes/interactions';
import loggerModule from '../../services/logger';
import { EmbedOptions } from '../../types/configTypes';
import { ValidatorParams } from '../../types/utilTypes';

const embedOptions: EmbedOptions = config.get('embedOptions');
export const checkQueueExists = async ({ interaction, queue, executionId }: ValidatorParams) => {
    const logger: Logger = loggerModule.child({
        module: 'utilValidation',
        name: 'queueDoesNotExist',
        executionId: executionId,
        shardId: interaction.guild?.shardId,
        guildId: interaction.guild?.id
    });

    const interactionIdentifier =
        interaction.type === InteractionType.ApplicationCommand ? interaction.commandName : interaction.customId;

    if (!queue) {
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${embedOptions.icons.warning} Oops!**\nThere are no tracks in the queue and nothing currently playing. First add some tracks with **\`/play\`**!`
                    )
                    .setColor(embedOptions.colors.warning)
            ]
        });

        logger.debug(`User tried to use command '${interactionIdentifier}' but there was no queue.`);
        throw new InteractionValidationError('Queue does not exist.');
    }

    return;
};

export const checkQueueCurrentTrack = async ({ interaction, queue, executionId }: ValidatorParams) => {
    const logger: Logger = loggerModule.child({
        module: 'utilValidation',
        name: 'queueNoCurrentTrack',
        executionId: executionId,
        shardId: interaction.guild?.shardId,
        guildId: interaction.guild?.id
    });

    const interactionIdentifier =
        interaction.type === InteractionType.ApplicationCommand ? interaction.commandName : interaction.customId;

    if (queue && !queue.currentTrack) {
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${embedOptions.icons.warning} Oops!**\nThere is nothing currently playing. First add some tracks with **\`/play\`**!`
                    )
                    .setColor(embedOptions.colors.warning)
            ]
        });

        logger.debug(`User tried to use command '${interactionIdentifier}' but there was no current track.`);
        throw new InteractionValidationError('Queue has no current track.');
    }

    return;
};

export const checkQueueEmpty = async ({ interaction, queue, executionId }: ValidatorParams) => {
    const logger: Logger = loggerModule.child({
        module: 'utilValidation',
        name: 'queueIsEmpty',
        executionId: executionId,
        shardId: interaction.guild?.shardId,
        guildId: interaction.guild?.id
    });

    const interactionIdentifier =
        interaction.type === InteractionType.ApplicationCommand ? interaction.commandName : interaction.customId;

    if (queue && queue.tracks.data.length === 0) {
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${embedOptions.icons.warning} Oops!**\nThere are no tracks added to the queue. First add some tracks with **\`/play\`**!`
                    )
                    .setColor(embedOptions.colors.warning)
            ]
        });

        logger.debug(`User tried to use command '${interactionIdentifier}' but there was no tracks in the queue.`);
        throw new InteractionValidationError('Queue is empty.');
    }

    return;
};
