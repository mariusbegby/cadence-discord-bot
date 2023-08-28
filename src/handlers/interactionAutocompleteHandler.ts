import { AutocompleteInteraction } from 'discord.js';
import loggerModule from '../services/logger';

const logger = loggerModule.child({
    source: 'interactionCutocompleteHandler.ts',
    module: 'handler',
    name: 'interactionAutocompleteHandler'
});

export const handleAutocomplete = async (interaction: AutocompleteInteraction, executionId: string) => {
    const autocompleteModule = await import(`../interactions/autocomplete/${interaction.commandName}.js`);
    const { default: autocomplete } = autocompleteModule;

    logger.debug('Executing autocomplete interaction.');
    await autocomplete.execute({ interaction, executionId });
};
