import type { Client, Collection } from 'discord.js';
import type {
    BaseAutocompleteInteraction,
    BaseComponentInteraction,
    BaseSlashCommandInteraction
} from '../common/classes/interactions';

type RegisterClientInteractionsFunction = (params: { client: Client; executionId: string }) => void;

export type ExtendedClient = {
    registerClientInteractions?: RegisterClientInteractionsFunction;
    slashCommandInteractions?: Collection<string, BaseSlashCommandInteraction>;
    autocompleteInteractions?: Collection<string, BaseAutocompleteInteraction>;
    componentInteractions?: Collection<string, BaseComponentInteraction>;
} & Client;
