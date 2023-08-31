import config from 'config';
import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    Interaction,
    InteractionReplyOptions,
    InteractionType,
    MessageComponentInteraction
} from 'discord.js';
import { Logger } from 'pino';
import loggerModule from '../services/logger';
import { BotOptions, EmbedOptions } from '../types/configTypes';
import { CustomError } from '../types/interactionTypes';

const embedOptions: EmbedOptions = config.get('embedOptions');
const botOptions: BotOptions = config.get('botOptions');

// TODO: Update TS Type for handlError
export const handleError = async (
    interaction: Interaction,
    error: CustomError,
    executionId: string,
    interactionIdentifier: string
) => {
    const logger: Logger = loggerModule.child({
        module: 'handler',
        name: 'interactionErrorHandler',
        executionId: executionId
    });

    // TODO: Extract replies for embeds
    const errorReply: InteractionReplyOptions = {
        embeds: [
            new EmbedBuilder()
                .setDescription(
                    `**${embedOptions.icons.error} Uh-oh... _Something_ went wrong!**\nThere was an unexpected error while trying to perform this action. You can try again.\n\n_If this problem persists, please submit a bug report in the **[support server](${botOptions.serverInviteUrl})**._`
                )
                .setColor(embedOptions.colors.error)
                .setFooter({ text: `Execution ID: ${executionId}` })
        ]
    };

    logger.debug(error, `Error handling interaction '${interactionIdentifier}' with execution ID ${executionId}`);

    if (interaction instanceof ChatInputCommandInteraction) {
        switch (interaction.replied) {
            case true:
                logger.warn(
                    error,
                    `Interaction '${interactionIdentifier}' threw an error but has already been replied to.`
                );
                return;
            case false:
                logger.debug('Responding with error embed');
                return await interaction.editReply(errorReply);
        }
    } else if (interaction instanceof MessageComponentInteraction) {
        switch (interaction.replied) {
            case true:
                logger.warn(
                    error,
                    `Interaction '${interactionIdentifier}' threw an error but has already been replied to.`
                );
                return;
            case false:
                logger.debug('Responding with error embed');
                return await interaction.editReply(errorReply);
        }
    } else {
        logger.debug(
            `${
                InteractionType[interaction.type]
            } interaction '${interactionIdentifier}' threw an error. Cannot send error reply.`
        );

        if (error.message === 'Unknown interaction') {
            logger.debug('Interaction no longer exists, timed out or has already been responded to.');
            return;
        }

        if (error.message === 'Collector received no interactions before ending with reason: time') {
            logger.debug('Interaction collector response timed out.');
            return;
        }
    }

    logger.fatal(
        error,
        `Unhandled error while handling interaction '${interactionIdentifier}'. Execution ID: ${executionId}`
    );
    return;
};
