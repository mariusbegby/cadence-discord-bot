import {
    ApplicationCommandOptionChoiceData,
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    Message,
    MessageComponentInteraction
} from 'discord.js';
import { ExtendedClient } from './clientTypes';

export type ShardInfo = {
    shardId: number;
    memUsage: number;
    guildCount: number;
    guildMemberCount: number;
    playerStatistics: {
        activeVoiceConnections: number;
        totalTracks: number;
        totalListeners: number;
    };
};

export type TrackMetadata = {
    bridge: {
        views: number;
    };
};

type BaseInteractionParams = {
    executionId: string;
};

export type BaseSlashCommandParams = {
    interaction: ChatInputCommandInteraction;
    client?: ExtendedClient;
} & BaseInteractionParams;

export type BaseAutocompleteParams = {
    interaction: AutocompleteInteraction;
} & BaseInteractionParams;

export type BaseComponentParams = {
    interaction: MessageComponentInteraction;
    referenceId?: string;
} & BaseInteractionParams;

export type BaseSlashCommandReturnType = Promise<Message<boolean> | void>;

export type BaseAutocompleteReturnType = Promise<ApplicationCommandOptionChoiceData | void>;

export type BaseComponentReturnType = Promise<Message<boolean> | void>;
