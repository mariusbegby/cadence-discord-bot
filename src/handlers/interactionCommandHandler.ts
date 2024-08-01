import type { ChatInputCommandInteraction } from 'discord.js';
import type { BaseSlashCommandInteraction } from '../common/classes/interactions';
import { loggerService, type Logger } from '../common/services/logger';
import type { ExtendedClient } from '../types/clientTypes';
import { checkChannelPermissionViewable } from '../common/validation/permissionValidator';

export const handleCommand = async (
    interaction: ChatInputCommandInteraction,
    client: ExtendedClient,
    executionId: string,
    interactionIdentifier: string
) => {
    const logger: Logger = loggerService.child({
        module: 'handler',
        name: 'interactionCommandHandler',
        executionId: executionId
    });

    await checkChannelPermissionViewable({ interaction, executionId });

    const slashCommand: BaseSlashCommandInteraction = client.slashCommandInteractions!.get(
        interactionIdentifier
    ) as BaseSlashCommandInteraction;
    if (!slashCommand) {
        logger.warn(`Interaction created but slash command '${interactionIdentifier}' was not found.`);
        return;
    }

    logger.debug(`Executing slash command interaction '${interactionIdentifier}'.`);
    await slashCommand.execute({ interaction, client, executionId });
};
