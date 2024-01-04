import config from 'config';
import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    Interaction,
    InteractionReplyOptions,
    InteractionType,
    Message,
    MessageComponentInteraction
} from 'discord.js';
import { Logger } from 'pino';
import { CustomError, InteractionValidationError } from '../classes/interactions';
import loggerModule from '../services/logger';
import { BotOptions, EmbedOptions } from '../types/configTypes';
import { useServerTranslator } from '../common/localeUtil';

const embedOptions: EmbedOptions = config.get('embedOptions');
const botOptions: BotOptions = config.get('botOptions');

export const handleError = async (
    interaction: Interaction,
    error: CustomError,
    executionId: string,
    interactionIdentifier: string
): Promise<Message | void> => {
    const logger: Logger = loggerModule.child({
        module: 'handler',
        name: 'interactionErrorHandler',
        executionId: executionId
    });
    const translator = useServerTranslator(interaction);

    try {
        if (error instanceof InteractionValidationError || error.type === 'InteractionValidationError') {
            logger.debug(
                `Interaction validation error '${error.message}' while handling interaction '${interactionIdentifier}'.`
            );
            return;
        }

        const errorReply: InteractionReplyOptions = {
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        translator('errors.unexpectedError', {
                            icon: embedOptions.icons.error,
                            serverInviteUrl: botOptions.serverInviteUrl
                        })
                    )
                    .setColor(embedOptions.colors.error)
                    .setFooter({ text: translator('errors.footerExecutionId', { executionId: executionId }) })
            ]
        };

        logger.debug(`Error handling interaction '${interactionIdentifier}'`);

        if (
            (interaction instanceof ChatInputCommandInteraction ||
                interaction instanceof MessageComponentInteraction) &&
            !interaction.replied
        ) {
            logger.debug('Responding with error embed');
            await interaction.deferReply();
            return await interaction.editReply(errorReply);
        } else {
            logger.debug(
                `${
                    InteractionType[interaction.type]
                } interaction '${interactionIdentifier}' threw an error. Cannot send error reply.`
            );

            if (error.message === 'Unknown interaction') {
                logger.debug('Interaction no longer exists, timed out, or has already been responded to.');
                return;
            }

            if (
                error.message === 'Collector received no interactions before ending with reason: time' &&
                interaction instanceof MessageComponentInteraction &&
                !interaction.replied
            ) {
                logger.debug('Interaction collector response timed out.');
                await interaction.deferReply();
                return await interaction.editReply(errorReply);
            }
        }

        logger.fatal(
            error,
            `Unhandled error while handling interaction '${interactionIdentifier}'. Execution ID: ${executionId}`
        );
    } catch (err) {
        logger.error(err, 'Error in handleError function.');
    }
};
