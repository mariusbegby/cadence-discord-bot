import { Client, Collection } from 'discord.js';

type RegisterClientCommandsFunction = (params: { client: Client; executionId: string }) => void;

export interface ExtendedClient extends Client {
    registerClientCommands?: RegisterClientCommandsFunction;
    commands?: Collection<string, NodeModule>;
}
