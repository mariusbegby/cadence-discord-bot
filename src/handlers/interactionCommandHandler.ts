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
) => {
    const logger: Logger = loggerModule.child({
        module: 'handler',
        name: 'interactionCommandHandler',
        executionId: executionId
    });

    await interaction.deferReply();
    logger.debug('Interaction deferred.');

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
