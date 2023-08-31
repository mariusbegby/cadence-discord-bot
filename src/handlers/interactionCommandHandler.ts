import { ChatInputCommandInteraction } from 'discord.js';
import { Logger } from 'pino';
import loggerModule from '../services/logger';
import { ExtendedClient } from '../types/clientTypes';
import { BaseSlashCommandInteraction } from '../types/interactionTypes';
import { cannotSendMessageInChannel } from '../utils/validation/permissionValidator';

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

    if (await cannotSendMessageInChannel({ interaction, executionId })) {
        return;
    }

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
