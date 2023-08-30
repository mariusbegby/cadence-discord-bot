import { AutocompleteInteraction } from 'discord.js';
import { Logger } from 'pino';
import loggerModule from '../services/logger';

export const handleAutocomplete = async (interaction: AutocompleteInteraction, executionId: string) => {
    // TODO: Define TS Type for handlers, and require logger constant?
    const logger: Logger = loggerModule.child({
        source: 'interactionCutocompleteHandler.ts',
        module: 'handler',
        name: 'interactionAutocompleteHandler',
        executionId: executionId
    });

    // TODO: Create TS Type for autocompleteModule
    const autocompleteModule = await import(`../interactions/autocomplete/${interaction.commandName}.js`);
    const { default: autocomplete } = autocompleteModule;

    logger.debug('Executing autocomplete interaction.');
    await autocomplete.execute({ interaction, executionId });
};
