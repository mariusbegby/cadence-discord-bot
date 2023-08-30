import { Client, Collection } from 'discord.js';
import { BaseSlashCommandInteraction } from './interactionTypes';

type RegisterClientCommandsFunction = (params: { client: Client; executionId: string }) => void;

export interface ExtendedClient extends Client {
    registerClientCommands?: RegisterClientCommandsFunction;
    commands?: Collection<string, BaseSlashCommandInteraction>;
}
