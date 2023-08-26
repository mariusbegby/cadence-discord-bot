import { Client } from 'discord.js';

type RegisterClientCommandsFunction = (params: { client: Client; executionId: string }) => void;

export interface ExtendedClient extends Client {
    registerClientCommands?: RegisterClientCommandsFunction;
}
