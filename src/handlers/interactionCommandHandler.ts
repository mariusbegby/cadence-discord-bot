import { ChatInputCommandInteraction } from 'discord.js';
import { Logger } from 'pino';
import { BaseSlashCommandInteraction } from '../classes/interactions';
import loggerModule from '../services/logger';
import { ExtendedClient } from '../types/clientTypes';
import { checkChannelPermissionViewable } from '../utils/validation/permissionValidator';

export const handleCommand = async (
    interaction: ChatInputCommandInteraction,
    client: ExtendedClient,
    executionId: string,
    interactionIdentifier: string
): Promise<void> => {
    const logger: Logger = loggerModule.child({
        module: 'handler',
        name: 'interactionCommandHandler',
        executionId: executionId
    });

    try {
        // Defer the interaction to provide more time for processing
        await interaction.deferReply();
        logger.debug('Interaction deferred.');

        // Check if the bot has permission to view the channel
        await checkChannelPermissionViewable({ interaction, executionId });

        const slashCommand: BaseSlashCommandInteraction | undefined =
            client.slashCommandInteractions?.get(interactionIdentifier);

        if (!slashCommand) {
            logger.warn(`Slash command '${interactionIdentifier}' not found.`);
            return;
        }

        logger.debug(`Executing slash command '${interactionIdentifier}'.`);
        await slashCommand.execute({ interaction, client, executionId });
    } catch (error) {
        logger.error(error, 'Error handling slash command interaction.');
    }
};
