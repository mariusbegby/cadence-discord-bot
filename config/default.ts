import type { HealthCheckConfig, LoggerServiceConfig, ShardClientConfig } from './types';

export const shardClientConfig: ShardClientConfig = {
    intents: ['guilds', 'guildVoiceStates'],
    maxShards: 'auto'
};

export const loggerServiceConfig: LoggerServiceConfig = {
    logLevel: 'info',
    pushLogsToLoki: false,
    prettyConsoleFormat: true,
    prettyConsoleIgnoreFields: ['environment', 'module', 'executionId', 'shardId', 'interactionId', 'guildId']
};

export const healthCheckConfig: HealthCheckConfig = {
    interval: 300_000
};
