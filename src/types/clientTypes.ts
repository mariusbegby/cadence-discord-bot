import { Client, Collection, SharedNameAndDescription } from 'discord.js';

type RegisterClientCommandsFunction = (params: { client: Client; executionId: string }) => void;

export interface Command {
    isNew?: boolean;
    isBeta?: boolean;
    isSystemCommand?: boolean;
    data: {
        name: string;
        description: string;
        options: SharedNameAndDescription[]
    };
    execute: (params: { interaction: object; client: ExtendedClient | undefined; executionId: string }) => void;
    autocomplete?: (params: { interaction: object; executionId: string }) => void;
}

export interface ExtendedClient extends Client {
    registerClientCommands?: RegisterClientCommandsFunction;
    commands?: Collection<string, Command>;
}
