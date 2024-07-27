import type { HealthCheckConfig, LoggerServiceConfig, ShardClientConfig } from '@config/types';
import type { ICoreValidator } from '@type/ICoreValidator';
import type { ILoggerService } from '@type/insights/ILoggerService';
import type { IConfig } from 'config';
import type { exec } from 'node:child_process';

type ConfigurationOptions = {
    shardClientConfig?: ShardClientConfig;
    loggerServiceConfig?: LoggerServiceConfig;
    healthCheckConfig?: HealthCheckConfig;
};

enum EnvironmentVariables {
    NodeEnv = 'NODE_ENV',
    DiscordBotToken = 'DISCORD_BOT_TOKEN',
    DiscordApplicationId = 'DISCORD_APPLICATION_ID',
    TotalShards = 'TOTAL_SHARDS'
}

type PackageJson = {
    version: string;
    repository: {
        url: string;
    };
};

export class CoreValidator implements ICoreValidator {
    private _logger: ILoggerService;
    private _config: IConfig;
    private _execute: typeof exec;
    private _fetch: typeof global.fetch;
    private _packageJson: PackageJson;

    constructor(
        logger: ILoggerService,
        config: IConfig,
        execute: typeof exec,
        fetch: typeof global.fetch,
        packageJson: PackageJson
    ) {
        this._logger = logger;
        this._config = config;
        this._execute = execute;
        this._fetch = fetch;
        this._packageJson = packageJson;
    }

    public async validateEnvironmentVariables() {
        this._logger.debug('Validating environment variables...');
        const requiredEnvironmentVariables: EnvironmentVariables[] = [
            EnvironmentVariables.NodeEnv,
            EnvironmentVariables.DiscordBotToken,
            EnvironmentVariables.DiscordApplicationId,
            EnvironmentVariables.TotalShards
        ];

        const missingEnvironmentVariables: EnvironmentVariables[] = [];
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
        this._checkYouTubeExtractorAuthTokens();

        this._logger.info('Successfully validated environment variables.');
    }

    public async validateConfiguration() {
        this._logger.debug('Validating configuration...');

        const loadedConfiguration: ConfigurationOptions = this._config.util.loadFileConfigs();
        this._logger.debug(loadedConfiguration, 'Using configuration:');

        const requiredConfiguration: Array<keyof ConfigurationOptions> = [
            'shardClientConfig',
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

    public async checkDependencies() {
        this._logger.debug('Checking for required dependencies...');

        // Check if FFmpeg is installed on the system
        await this._checkFFmpegInstalled();

        // Check Node.js version
        await this._checkNodeJsVersion();

        this._logger.info('Successfully checked required dependencies.');
    }

    public async checkApplicationVersion() {
        this._logger.debug('Checking application version...');
        const currentVersion = this._packageJson.version;
        this._logger.debug(`Current version is ${currentVersion}`);

        const latestVersion = (await this._getLatestVersion()).replace('v', '');
        if (latestVersion === 'undefined') {
            this._logger.warn('Failed to fetch the latest version from GitHub.');
            return;
        }
        if (latestVersion !== currentVersion) {
            this._logger.warn(`New version available: ${latestVersion}`);
            this._logger.warn(`You are currently using version: ${currentVersion}`);
            this._logger.warn("Please consider updating the application with 'git pull'.");
        }

        this._logger.info('Successfully checked application version.');
    }

    private async _getLatestVersion(): Promise<string> {
        const repoUrlArray = this._packageJson.repository.url.split('/');
        const repoIdentifier = `${repoUrlArray[3]}/${repoUrlArray[4]}`;
        if (!repoIdentifier || repoIdentifier === '/' || repoIdentifier.includes('undefined')) {
            return 'undefined';
        }
        try {
            const response = await this._fetch(`https://api.github.com/repos/${repoIdentifier}/releases/latest`);
            const data = await response.json();
            return data.tag_name ?? 'undefined';
        } catch (error) {
            this._logger.warn('Failed to fetch the latest version from GitHub.');
            return 'undefined';
        }
    }

    private async _checkYouTubeExtractorAuthTokens() {
        const ytAuthTokens = this._retreiveYouTubeExtractorAuthTokens();
        if (ytAuthTokens.length === 0) {
            this._logger.warn(
                'YT_EXTRACTOR_AUTH token is not set. This is required for the YouTube extractor to work properly.'
            );
        }

        const validAuthTokens: string[] = [];
        ytAuthTokens.forEach((authToken, index) => {
            if (authToken.startsWith('access_token=') && authToken.includes('token_type')) {
                validAuthTokens.push(authToken);
            } else {
                this._logger.warn(
                    `YT_EXTRACTOR_AUTH token at index ${index} is not valid. This is required for the YouTube extractor to work properly.`
                );
            }
        });

        this._logger.debug(`Found ${validAuthTokens.length} valid YT_EXTRACTOR_AUTH tokens.`);
    }

    private _retreiveYouTubeExtractorAuthTokens(): string[] {
        return Object.keys(process.env)
            .filter((v) => v.startsWith('YT_EXTRACTOR_AUTH'))
            .map((k) => process.env[k])
            .filter((v) => v !== undefined);
    }

    private async _checkFFmpegInstalled() {
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

    private async _checkNodeJsVersion() {
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
                    const latestSupportedVersion = 20;
                    if (nodeMajorVersion < latestSupportedVersion) {
                        this._logger.warn(
                            `Node.js version is below supported version ${latestSupportedVersion}. Please consider upgrading to LTS version.`
                        );
                    }
                }

                resolve();
            });
        });
    }
}
