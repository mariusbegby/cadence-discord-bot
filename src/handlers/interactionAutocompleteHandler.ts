import { AutocompleteInteraction } from 'discord.js';
import { BaseAutocompleteInteraction } from '../common/classes/interactions';
import { loggerService, Logger } from '../common/services/logger';
import { ExtendedClient } from '../types/clientTypes';

export const handleAutocomplete = async (
    interaction: AutocompleteInteraction,
    client: ExtendedClient,
    executionId: string,
    interactionIdentifier: string
) => {
    // TODO: Define TS Type for handlers, and require logger constant?
    const logger: Logger = loggerService.child({
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
