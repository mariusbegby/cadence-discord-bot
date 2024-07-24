import { HealthCheckConfig, LoggerServiceConfig, ShardManagerConfig } from './types';

export const shardManagerConfig: ShardManagerConfig = {
    totalShards: 'auto',
    shardList: 'auto',
    mode: 'process',
    respawn: true
};

export const loggerServiceConfig: LoggerServiceConfig = {
    logLevel: 'info',
    pushLogsToLoki: false,
    prettyConsoleFormat: true,
    prettyConsoleIgnoreFields: ['environment', 'module', 'executionId', 'shardId', 'guildId']
};

export const healthCheckConfig: HealthCheckConfig = {
    interval: 300_000
};
