import { AutocompleteInteraction, ChatInputCommandInteraction } from 'discord.js';

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

export interface ShardInfo {
    shardId: number;
    memUsage: number;
    guildCount: number;
    guildMemberCount: number;
    playerStatistics: {
        activeVoiceConnections: number;
        totalTracks: number;
        totalListeners: number;
    };
}

export interface TrackMetadata {
    bridge: {
        views: number;
    };
}

export class CustomError extends Error {
    type?: string;
    code?: string;
}
