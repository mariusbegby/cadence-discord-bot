import { ChatInputCommandInteraction, AutocompleteInteraction } from 'discord.js';
import { ExtendedClient } from './clientTypes';

export interface CommandParams {
    interaction: ChatInputCommandInteraction;
    client: ExtendedClient | undefined;
    executionId: string;
}

export interface CommandAutocompleteParams {
    interaction: AutocompleteInteraction;
    client: ExtendedClient | undefined;
    executionId: string;
}
