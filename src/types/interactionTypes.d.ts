import {
    ApplicationCommandOptionChoiceData,
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    Message,
    MessageComponentInteraction
} from 'discord.js';
import { ExtendedClient } from './clientTypes';

export type PlayerStatistics = {
    activeVoiceConnections: number;
    totalTracks: number;
    totalListeners: number;
};

export type ShardInfo = {
    shardId: number;
    memUsage: number;
    guildCount: number;
    guildMemberCount: number;
    playerStatistics: PlayerStatistics;
};

export type Bridge = {
    views: number;
};

export type TrackMetadata = {
    bridge: Bridge;
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

export enum FilterType {
    FFmpeg = 'ffmpeg',
    Biquad = 'biquad',
    Equalizer = 'equalizer',
    Disable = 'disable'
}

export type RecentQuery = {
    lastQuery: string;
    result: ApplicationCommandOptionChoiceData<string>[];
    timestamp: number;
};
