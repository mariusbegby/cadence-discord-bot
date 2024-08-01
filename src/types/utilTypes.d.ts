import type { GuildQueue, Player } from 'discord-player';
import type { ChatInputCommandInteraction, MessageComponentInteraction } from 'discord.js';
import type { ExtendedClient } from './clientTypes';

export type RegisterEventListenersParams = {
    client: ExtendedClient;
    player: Player;
    executionId: string;
};

export type RegisterClientInteractionsParams = {
    client: ExtendedClient;
    executionId: string;
};

export type CustomEvent = {
    name: string;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    execute: (...args: any) => void;
    once?: boolean;
    isDebug?: boolean;
    isPlayerEvent?: boolean;
};

export type Validator = (args: ValidatorParams) => Promise<void>;

export type ValidatorParams = {
    interaction: ChatInputCommandInteraction | MessageComponentInteraction;
    queue?: GuildQueue;
    history?: GuildQueueHistory;
    executionId: string;
};

export type TransformQueryParams = {
    query: string;
    executionId: string;
};

export type GetUptimeFormattedParams = {
    executionId: string;
};

export type StartLoadTestParams = {
    client: ExtendedClient;
    executionId: string;
};

export type ShardPlayerStatistics = {
    totalVoiceConnections: number;
    totalTracksInQueues: number;
    totalListeners: number;
};

export type PlayerStatistics = {
    instances: number;
    queuesCount: number;
    queryCacheEnabled: boolean;
    queues: GuildQueueStatisticsMetadata[];
};
