import { ChatInputCommandInteraction } from 'discord.js';
import { Command, ExtendedClient } from '../types/clientTypes';
import { cannotSendMessageInChannel } from '../utils/validation/permissionValidator';
import loggerModule from '../services/logger';

export const handleCommand = async (
    interaction: ChatInputCommandInteraction,
    client: ExtendedClient,
    executionId: string
) => {
    const logger = loggerModule.child({
        source: 'interactionCommandHandler.ts',
        module: 'handler',
        name: 'interactionCommandHandler',
        executionId: executionId
    });

    await interaction.deferReply();
    logger.debug('Interaction deferred.');

    const command = client.commands?.get(interaction.commandName) as Command;
    if (!command) {
        logger.warn(`Interaction created but command '${interaction.commandName}' was not found.`);
        return;
    }

    if (await cannotSendMessageInChannel({ interaction, executionId })) {
        return;
    }

    logger.debug('Executing command interaction.');
    await command.execute({ interaction, client, executionId });
};
