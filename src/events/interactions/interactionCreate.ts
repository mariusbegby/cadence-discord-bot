import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    Events,
    Interaction,
    InteractionType,
    MessageComponentInteraction
} from 'discord.js';
import { Logger } from 'pino';
import { v4 as uuidv4 } from 'uuid';
import { handleAutocomplete } from '../../handlers/interactionAutocompleteHandler';
import { handleCommand } from '../../handlers/interactionCommandHandler';
import { handleComponent } from '../../handlers/interactionComponentHandler';
import { handleError } from '../../handlers/interactionErrorHandler';
import loggerModule from '../../services/logger';
import { ExtendedClient } from '../../types/clientTypes';
import { CustomError } from '../../classes/interactions';

module.exports = {
    name: Events.InteractionCreate,
    isDebug: false,
    execute: async (interaction: Interaction, { client }: { client: ExtendedClient }) => {
        const inputTime: number = new Date().getTime();
        const executionId: string = uuidv4();
        const logger: Logger = loggerModule.child({
            module: 'event',
            name: 'interactionCreate',
            executionId: executionId,
            shardId: interaction.guild?.shardId,
            guildId: interaction.guild?.id
        });

        logger.debug('Interaction received.');

        let interactionIdentifier: string = 'Unknown';
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
                    await handleCommand(
                        interaction as ChatInputCommandInteraction,
                        client,
                        executionId,
                        interactionIdentifier
                    );
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
                    logger.error(
                        interaction,
                        `Interaction of type '${interaction.type}' was not handled, interaction attached as object.`
                    );
                    break;
            }
        } catch (error) {
            logger.debug('Error while handling received interaction.');
            await handleError(interaction, error as CustomError, executionId, interactionIdentifier);
        }

        const outputTime: number = new Date().getTime();
        const executionTime: number = outputTime - inputTime;

        const interactionType: string = InteractionType[interaction.type];

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
