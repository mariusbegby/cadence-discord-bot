import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    Events,
    Interaction,
    InteractionType,
    MessageComponentInteraction
} from 'discord.js';
import { randomUUID as uuidv4 } from 'node:crypto';
import { CustomError } from '../../classes/interactions';
import { handleAutocomplete } from '../../handlers/interactionAutocompleteHandler';
import { handleCommand } from '../../handlers/interactionCommandHandler';
import { handleComponent } from '../../handlers/interactionComponentHandler';
import { handleError } from '../../handlers/interactionErrorHandler';
import loggerModule from '../../services/logger';
import { ExtendedClient } from '../../types/clientTypes';

module.exports = {
    name: Events.InteractionCreate,
    isDebug: false,
    execute: async (interaction: Interaction, { client }: { client: ExtendedClient }) => {
        const inputTime = new Date().getTime();
        const executionId = uuidv4();
        const logger = loggerModule.child({
            module: 'event',
            name: 'interactionCreate',
            executionId,
            shardId: interaction.guild?.shardId,
            guildId: interaction.guild?.id
        });

        logger.debug('Interaction received.');

        const interactionIdentifier = getInteractionIdentifier(interaction);

        try {
            logger.debug('Started handling interaction.');
            await handleInteraction(interaction, client, executionId, interactionIdentifier);
        } catch (error) {
            logger.debug('Error while handling received interaction.');
            await handleError(interaction, error as CustomError, executionId, interactionIdentifier);
        }

        const executionTime = new Date().getTime() - inputTime;
        const interactionType = InteractionType[interaction.type];

        logger.info(
            {
                executionTime,
                interactionType
            },
            `${interactionType} interaction '${interactionIdentifier}' successfully handled in ${executionTime} ms.`
        );

        if (executionTime > 10000) {
            logger.warn(
                `${interactionType} interaction '${interactionIdentifier}' took ${executionTime} ms to execute.`
            );
        }

        return;
    }
};

async function handleInteraction(
    interaction: Interaction,
    client: ExtendedClient,
    executionId: string,
    interactionIdentifier: string
) {
    switch (interaction.type) {
        case InteractionType.ApplicationCommand:
            await handleCommand(interaction as ChatInputCommandInteraction, client, executionId, interactionIdentifier);
            break;

        case InteractionType.ApplicationCommandAutocomplete:
            await handleAutocomplete(
                interaction as AutocompleteInteraction,
                client,
                executionId,
                interactionIdentifier
            );
            break;

        case InteractionType.MessageComponent:
            await handleComponent(
                interaction as MessageComponentInteraction,
                client,
                executionId,
                interactionIdentifier
            );
            break;

        default:
            throw new Error(`Interaction of type '${interaction.type}' was not handled`);
    }
}

function getInteractionIdentifier(interaction: Interaction): string {
    switch (interaction.type) {
        case InteractionType.ApplicationCommand:
        case InteractionType.ApplicationCommandAutocomplete:
            return (interaction as ChatInputCommandInteraction).commandName;

        case InteractionType.MessageComponent:
            return (interaction as MessageComponentInteraction).customId;

        default:
            return 'Unknown';
    }
}
