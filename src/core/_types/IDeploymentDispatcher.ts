enum ApplicationCommandType {
    ChatInput = 1,
    User = 2,
    Message = 3
}

export type SlashCommandListData = {
    type?: ApplicationCommandType;
    description: string;
};

export type SlashCommandData = {
    name: string;
};

export interface IDeploymentDispatcher {
    refreshSlashCommands(): Promise<void>;
}
