import { MessageComponentInteraction } from 'discord.js';
import { Logger } from 'pino';
import { BaseComponentInteraction } from '../classes/interactions';
import loggerModule from '../services/logger';
import { ExtendedClient } from '../types/clientTypes';
import { checkChannelPermissionViewable } from '../utils/validation/permissionValidator';

export const handleComponent = async (
    interaction: MessageComponentInteraction,
    client: ExtendedClient,
    executionId: string,
    interactionIdentifier: string
): Promise<void> => {
    const logger: Logger = loggerModule.child({
        module: 'handler',
        name: 'interactionComponentHandler',
        executionId: executionId
    });

    try {
        // Defer the interaction to provide more time for processing
        await interaction.deferReply();
        logger.debug('Interaction deferred.');

        // Extract componentId and referenceId from the interactionIdentifier
        const [componentId, referenceId] = interactionIdentifier.split('_');

        logger.debug(`Parsed componentId '${componentId}' from identifier '${interactionIdentifier}'.`);

        // Check if the bot has permission to view the channel
        await checkChannelPermissionViewable({ interaction, executionId });

        const component: BaseComponentInteraction | undefined = client.componentInteractions?.get(componentId);

        if (!component) {
            logger.warn(`Component '${componentId}' not found.`);
            return;
        }

        logger.debug(`Executing component '${componentId}' interaction.`);
        await component.execute({ interaction, referenceId, executionId });
    } catch (error) {
        logger.error(error, 'Error handling component interaction.');
    }
};
