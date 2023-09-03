import { Client, Collection } from 'discord.js';
import {
    BaseAutocompleteInteraction,
    BaseComponentInteraction,
    BaseSlashCommandInteraction
} from '../classes/interactions';

type RegisterClientInteractionsFunction = (params: { client: Client; executionId: string }) => void;

export type ExtendedClient = {
    registerClientInteractions?: RegisterClientInteractionsFunction;
    slashCommandInteractions?: Collection<string, BaseSlashCommandInteraction>;
    autocompleteInteractions?: Collection<string, BaseAutocompleteInteraction>;
    componentInteractions?: Collection<string, BaseComponentInteraction>;
} & Client;
