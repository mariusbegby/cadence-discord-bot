import { AutocompleteInteraction } from 'discord.js';
import { Logger } from 'pino';
import { BaseAutocompleteInteraction } from '../classes/interactions';
import loggerModule from '../services/logger';
import { ExtendedClient } from '../types/clientTypes';

export const handleAutocomplete = async (
    interaction: AutocompleteInteraction,
    client: ExtendedClient,
    executionId: string,
    interactionIdentifier: string
): Promise<void> => {
    const logger: Logger = loggerModule.child({
        module: 'handler',
        name: 'interactionAutocompleteHandler',
        executionId: executionId
    });

    try {
        const autocomplete: BaseAutocompleteInteraction | undefined =
            client.autocompleteInteractions?.get(interactionIdentifier);

        if (!autocomplete) {
            logger.warn(`Autocomplete interaction '${interactionIdentifier}' not found.`);
            return;
        }

        logger.debug(`Executing autocomplete interaction '${interactionIdentifier}'.`);
        await autocomplete.execute({ interaction, executionId });
    } catch (error) {
        logger.error(error, 'Error handling autocomplete interaction.');
        // Handle errors or log them as needed
    }
};
