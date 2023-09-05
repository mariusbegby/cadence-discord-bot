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
) => {
    const logger: Logger = loggerModule.child({
        module: 'handler',
        name: 'interactionComponentHandler',
        executionId: executionId
    });

    await interaction.deferReply();
    logger.debug('Interaction deferred.');

    const componentId: string = interactionIdentifier.split('_')[0];
    const referenceId: string = interactionIdentifier.split('_')[1];

    logger.debug(`Parsed componentId '${componentId}' from identifier '${interactionIdentifier}'.`);

    await checkChannelPermissionViewable({ interaction, executionId });

    const component: BaseComponentInteraction = client.componentInteractions!.get(
        componentId
    ) as BaseComponentInteraction;
    if (!component) {
        logger.warn(`Interaction created but component '${componentId}' was not found.`);
        return;
    }

    logger.debug(`Executing component interaction '${componentId}'.`);
    await component.execute({ interaction, referenceId, executionId });
};
