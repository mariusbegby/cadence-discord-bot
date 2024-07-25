import type { HealthCheckConfig, LoggerServiceConfig, ShardManagerConfig } from '@config/types';
import type { ICoreValidator } from '@type/ICoreValidator';
import type { ILoggerService } from '@type/insights/ILoggerService';
import type { IConfig } from 'config';
import type { exec } from 'node:child_process';

type ConfigurationOptions = {
    shardManagerConfig?: ShardManagerConfig;
    loggerServiceConfig?: LoggerServiceConfig;
    healthCheckConfig?: HealthCheckConfig;
};

type EnvironmentVariables = {
    NODE_ENV: 'development' | 'production';
    DISCORD_BOT_TOKEN: string;
    DISCORD_APPLICATION_ID: number;
    TOTAL_SHARDS: 'AUTO' | number;
};

export class CoreValidator implements ICoreValidator {
    _logger: ILoggerService;
    _config: IConfig;
    _execute: typeof exec;

    constructor(logger: ILoggerService, config: IConfig, execute: typeof exec) {
        this._logger = logger;
        this._config = config;
        this._execute = execute;
    }

    async validateEnvironmentVariables() {
        this._logger.debug('Validating environment variables...');
        const requiredEnvironmentVariables: Array<keyof EnvironmentVariables> = [
            'NODE_ENV',
            'DISCORD_BOT_TOKEN',
            'DISCORD_APPLICATION_ID',
            'TOTAL_SHARDS'
        ];

        const missingEnvironmentVariables: Array<keyof EnvironmentVariables> = [];
        for (const requiredEnvironmentVariable of requiredEnvironmentVariables) {
            if (!process.env[requiredEnvironmentVariable] || process.env[requiredEnvironmentVariable].length === 0) {
                missingEnvironmentVariables.push(requiredEnvironmentVariable);
            }
        }

        if (missingEnvironmentVariables.length > 0) {
            const errorMessage = `Missing the following required environment variables: ${missingEnvironmentVariables.join(', ')}. Exiting...`;
            this._logger.error(errorMessage);
            process.exit(1);
        }

        this._logger.debug('NODE_ENV is set.');
        this._logger.debug('TOTAL_SHARDS is set.');
        this._logger.debug('DISCORD_BOT_TOKEN is set.');
        this._logger.debug('DISCORD_APPLICATION_ID is set.');

        // Check that NODE_ENV is set to development or production
        if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'production') {
            const errorMessage =
                'NODE_ENV is not set to development or production. Please set it to either of these values. Exiting...';
            this._logger.error(errorMessage);
            process.exit(1);
        }
        this._logger.debug(`NODE_ENV is set to ${process.env.NODE_ENV}.`);

        // Check TOTAL_SHARDS
        if (process.env.TOTAL_SHARDS !== 'AUTO' && Number.isNaN(Number(process.env.TOTAL_SHARDS))) {
            const errorMessage =
                'TOTAL_SHARDS is not set to AUTO or a valid number. Please set it to AUTO or the total number of shards. Exiting...';
            this._logger.error(errorMessage);
            process.exit(1);
        }
        this._logger.debug(`TOTAL_SHARDS is set to ${process.env.TOTAL_SHARDS}.`);

        // Check if YT_EXTRACTOR_AUTH is set and valid, warn if not
        this.checkYouTubeExtractorAuthTokens();

        this._logger.info('Successfully validated environment variables.');
    }

    async validateConfiguration() {
        this._logger.debug('Validating configuration...');

        const loadedConfiguration: ConfigurationOptions = this._config.util.loadFileConfigs();
        this._logger.debug(loadedConfiguration, 'Using configuration:');

        const requiredConfiguration: Array<keyof ConfigurationOptions> = [
            'shardManagerConfig',
            'loggerServiceConfig',
            'healthCheckConfig'
        ];

        const missingConfiguration: Array<keyof ConfigurationOptions> = [];
        for (const requiredConfig of requiredConfiguration) {
            if (!loadedConfiguration[requiredConfig]) {
                missingConfiguration.push(requiredConfig);
            }
        }

        if (missingConfiguration.length > 0) {
            const errorMessage = `Missing the following required configuration options: ${missingConfiguration.join(', ')}.`;
            this._logger.error(errorMessage);
            throw new Error(errorMessage);
        }

        this._logger.info('Successfully validated configuration.');
    }

    async checkDependencies() {
        this._logger.debug('Checking for required dependencies...');

        // Check if FFmpeg is installed on the system
        await this.checkFFmpegInstalled();

        // Check Node.js version
        await this.checkNodeJsVersion();

        this._logger.info('Successfully checked required dependencies.');
    }

    private async checkYouTubeExtractorAuthTokens() {
        const ytAuthTokens = this.retreiveYouTubeExtractorAuthTokens();
        if (ytAuthTokens.length === 0) {
            this._logger.warn(
                'YT_EXTRACTOR_AUTH token is not set. This is required for the YouTube extractor to work properly.'
            );
        }

        const validAuthTokens: Array<string> = [];
        ytAuthTokens.forEach((authToken, index) => {
            if (!(authToken.startsWith('access_token=') || authToken.includes('token_type'))) {
                this._logger.warn(
                    `YT_EXTRACTOR_AUTH token at index ${index} is not valid. This is required for the YouTube extractor to work properly.`
                );
            } else {
                validAuthTokens.push(authToken);
            }
        });

        this._logger.debug(`Found ${validAuthTokens.length} valid YT_EXTRACTOR_AUTH tokens.`);
    }

    private retreiveYouTubeExtractorAuthTokens(): string[] {
        return Object.keys(process.env)
            .filter((v) => v.startsWith('YT_EXTRACTOR_AUTH'))
            .map((k) => process.env[k])
            .filter((v) => v !== undefined);
    }

    private async checkFFmpegInstalled() {
        await new Promise<void>((resolve, reject) => {
            this._execute('ffmpeg -version', (error) => {
                if (error) {
                    this._logger.error('FFmpeg is not installed on your system.');
                    this._logger.error('Make sure you have FFmpeg installed and try again.');
                    this._logger.error('If you are using Windows, make sure to add FFmpeg to your PATH.');
                    this._logger.error('Exiting...');
                    reject(error);
                    process.exit(1);
                }

                this._logger.debug('FFmpeg is installed.');
                resolve();
            });
        });
    }

    private async checkNodeJsVersion() {
        await new Promise<void>((resolve, reject) => {
            this._execute('node -v', (error, stdout) => {
                if (error) {
                    this._logger.error('An error occurred while checking Node.js version. Exiting...');
                    reject(error);
                    process.exit(1);
                } else {
                    const nodeVersionString = stdout.trim();
                    const nodeVersionArray = nodeVersionString
                        .split('.')
                        .map((n) => Number.parseInt(n.replace('v', '')));
                    this._logger.debug(`Detected Node.js version: ${nodeVersionString}`);

                    let nodeMajorVersion = nodeVersionArray[0];
                    if (typeof nodeMajorVersion !== 'number' || Number.isNaN(nodeMajorVersion)) {
                        nodeMajorVersion = 0;
                    }
                    const LATEST_SUPPORTED_VERSION = 20;
                    if (nodeMajorVersion < LATEST_SUPPORTED_VERSION) {
                        this._logger.warn(
                            `Node.js version is below supported version ${LATEST_SUPPORTED_VERSION}. Please consider upgrading to LTS version.`
                        );
                    }
                }

                resolve();
            });
        });
    }
}
