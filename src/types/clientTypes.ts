import { Client, Collection } from 'discord.js';
import { BaseAutocompleteInteraction, BaseComponentInteraction, BaseSlashCommandInteraction } from './interactionTypes';

type RegisterClientInteractionsFunction = (params: { client: Client; executionId: string }) => void;

export interface ExtendedClient extends Client {
    registerClientInteractions?: RegisterClientInteractionsFunction;
    slashCommandInteractions?: Collection<string, BaseSlashCommandInteraction>;
    autocompleteInteractions?: Collection<string, BaseAutocompleteInteraction>;
    componentInteractions?: Collection<string, BaseComponentInteraction>;
}
