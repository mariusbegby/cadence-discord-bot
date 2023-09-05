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
) => {
    // TODO: Define TS Type for handlers, and require logger constant?
    const logger: Logger = loggerModule.child({
        module: 'handler',
        name: 'interactionAutocompleteHandler',
        executionId: executionId
    });

    const autocomplete: BaseAutocompleteInteraction = client.autocompleteInteractions!.get(
        interactionIdentifier
    ) as BaseAutocompleteInteraction;
    if (!autocomplete) {
        logger.warn(`Interaction created but autocomplete '${interactionIdentifier}' was not found.`);
        return;
    }

    logger.debug(`Executing autocomplete interaction '${interactionIdentifier}'.`);
    await autocomplete.execute({ interaction, executionId });
};
