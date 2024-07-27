import type { ShardClient } from '@core/ShardClient';
import type { ILoggerService } from '@type/insights/ILoggerService';

export enum ShardClientEvents {
    AllShardsReady = 'ready', // no params - All shards are ready
    AllShardsDisconnect = 'disconnect' // no params - All shards are disconnected
}

export enum ShardEvents {
    ShardReady = 'shardReady', // shardId
    ShardPreReady = 'shardPreReady', // shardId
    ShardDisconnect = 'shardDisconnect', // shardId
    ShardResume = 'shardResume', // shardId
    Connect = 'connect', // shardId - Fired when the shard establishes a connection
    GuildCreate = 'guildCreate', // guild
    GuildDelete = 'guildDelete', // guild
    InteractionCreate = 'interactionCreate', // interaction (PingInteraction, CommandInteraction, ComponentInteraction, AutocompleteInteraction, UnknownInteraction)
    Hello = 'hello', // trace, shardId
    Unknown = 'unknown', // packet, shardId
    Debug = 'debug', // message, shardId
    Warn = 'warn', // message, shardId
    Error = 'error' // message, shardId
}

export enum ProcessEvents {
    UncaughtException = 'uncaughtException', // error
    UnhandledRejection = 'unhandledRejection' // error
}

export interface IEventHandler {
    name: string;
    once: boolean;
    // biome-ignore lint/suspicious/noExplicitAny: Events have different arguments and types
    run: (logger: ILoggerService, shardClient: ShardClient, ...args: any[]) => Promise<void>;
}
