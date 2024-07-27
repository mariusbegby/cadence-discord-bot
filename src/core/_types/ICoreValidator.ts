import type { HealthCheckConfig, LoggerServiceConfig, ShardClientConfig } from '@config/types';
import type { ILoggerService } from '@type/insights/ILoggerService';
import type { IConfig } from 'config';

export interface ICoreValidator {
    _logger: ILoggerService;
    _config: IConfig;

    validateEnvironmentVariables(): void;
    validateConfiguration(): void;
    checkDependencies(): void;
    checkApplicationVersion(): void;
}

export type ConfigurationOptions = {
    shardClientConfig?: ShardClientConfig;
    loggerServiceConfig?: LoggerServiceConfig;
    healthCheckConfig?: HealthCheckConfig;
};

export enum EnvironmentVariables {
    NodeEnv = 'NODE_ENV',
    DiscordBotToken = 'DISCORD_BOT_TOKEN',
    DiscordApplicationId = 'DISCORD_APPLICATION_ID',
    TotalShards = 'TOTAL_SHARDS'
}

export type PackageJson = {
    version: string;
    repository: {
        url: string;
    };
};