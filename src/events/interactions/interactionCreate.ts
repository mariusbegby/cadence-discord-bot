import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    Events,
    Interaction,
    InteractionType,
    MessageComponentInteraction
} from 'discord.js';
import { v4 as uuidv4 } from 'uuid';

import { handleAutocomplete } from '../../handlers/interactionAutocompleteHandler';
import { handleCommand } from '../../handlers/interactionCommandHandler';
import { handleComponent } from '../../handlers/interactionComponentHandler';
import { handleError } from '../../handlers/interactionErrorHandler';
import loggerModule from '../../services/logger';
import { ExtendedClient } from '../../types/clientTypes';
import { CustomError } from '../../types/interactionTypes';

module.exports = {
    name: Events.InteractionCreate,
    isDebug: false,
    execute: async (interaction: Interaction, { client }: { client: ExtendedClient }) => {
        const inputTime: number = new Date().getTime();
        const executionId = uuidv4();
        const logger = loggerModule.child({
            source: 'interactionCreate.js',
            module: 'event',
            name: 'interactionCreate',
            executionId: executionId,
            shardId: interaction.guild?.shardId,
            guildId: interaction.guild?.id
        });

        logger.debug('Interaction received.');

        let interactionIdentifier = 'Unknown';
        if (
            interaction.type === InteractionType.ApplicationCommand ||
            interaction.type === InteractionType.ApplicationCommandAutocomplete
        ) {
            interactionIdentifier = (interaction as ChatInputCommandInteraction).commandName;
        } else if (interaction.type === InteractionType.MessageComponent) {
            interactionIdentifier = (interaction as MessageComponentInteraction).customId;
        }

        try {
            logger.debug('Started handling interaction.');
            switch (interaction.type) {
                case InteractionType.ApplicationCommand:
                    await handleCommand(interaction as ChatInputCommandInteraction, client, executionId);
                    break;

                case InteractionType.ApplicationCommandAutocomplete:
                    await handleAutocomplete(interaction as AutocompleteInteraction, executionId);
                    break;

                case InteractionType.MessageComponent:
                    await handleComponent(interaction as MessageComponentInteraction, executionId);
                    break;

                default:
                    logger.error(
                        interaction,
                        `Interaction of type '${interaction.type}' was not handled, interaction attached as object.`
                    );
                    break;
            }
        } catch (error) {
            logger.debug('Error while handling received interaction.');
            await handleError(interaction, error as CustomError, interactionIdentifier, executionId);
        }

        const outputTime: number = new Date().getTime();
        const executionTime: number = outputTime - inputTime;

        const interactionType = InteractionType[interaction.type];

        logger.info(
            {
                executionTime: executionTime,
                interactionType: interactionType
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
