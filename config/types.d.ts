import type { ShardingManagerOptions } from 'discord.js';

type ShardManagerConfig = {} & ShardingManagerOptions;

type LoggerServiceConfig = {
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    pushLogsToLoki: boolean;
    prettyConsoleFormat: boolean;
    prettyConsoleIgnoreFields: string[];
};

type HealthCheckConfig = {
    interval: number;
};
