import { EnvironmentVariables, type ConfigurationOptions, type PackageJson, type ICoreValidator } from '@type/ICoreValidator';
import type { ILoggerService } from '@type/insights/ILoggerService';
import type { IConfig } from 'config';
import type { exec } from 'node:child_process';

export class CoreValidator implements ICoreValidator {
    public _logger: ILoggerService;
    public _config: IConfig;
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

    public async validateEnvironmentVariables(): Promise<void> {
        this._logger.debug('Validating environment variables...');

        const missingEnvironmentVariables = Object.values(EnvironmentVariables).filter((env) => !process.env[env]);

        if (missingEnvironmentVariables.length > 0) {
            const errorMessage = `Missing the following required environment variables: ${missingEnvironmentVariables.join(', ')}. Exiting...`;
            this._logger.error(errorMessage);
            process.exit(1);
        }

        this._logger.debug('NODE_ENV is set.');
        this._logger.debug('TOTAL_SHARDS is set.');
        this._logger.debug('DISCORD_BOT_TOKEN is set.');
        this._logger.debug('DISCORD_APPLICATION_ID is set.');

        if (!['development', 'production'].includes(process.env.NODE_ENV ?? '')) {
            const errorMessage = 'NODE_ENV is not set to development or production. Please set it to either of these values. Exiting...';
            this._logger.error(errorMessage);
            process.exit(1);
        }

        this._logger.debug(`NODE_ENV is set to ${process.env.NODE_ENV}.`);

        const totalShards = process.env.TOTAL_SHARDS;
        if (totalShards !== 'AUTO' && Number.isNaN(Number(totalShards))) {
            const errorMessage = 'TOTAL_SHARDS is not set to AUTO or a valid number. Please set it to AUTO or the total number of shards. Exiting...';
            this._logger.error(errorMessage);
            process.exit(1);
        }

        this._logger.debug(`TOTAL_SHARDS is set to ${process.env.TOTAL_SHARDS}.`);

        this._validateYouTubeAuthTokens();
        this._logger.info('Successfully validated environment variables.');
    }

    public async validateConfiguration(): Promise<void> {
        this._logger.debug('Validating configuration...');

        const loadedConfig = this._config.util.loadFileConfigs();
        this._logger.debug(loadedConfig, 'Using configuration:');

        const requiredConfigs: Array<keyof ConfigurationOptions> = ['shardClientConfig', 'loggerServiceConfig', 'healthCheckConfig'];
        const missingConfiguration = requiredConfigs.filter((config) => !loadedConfig[config]);

        if (missingConfiguration.length > 0) {
            const errorMessage = `Missing the following required configuration options: ${missingConfiguration.join(', ')}.`;
            this._logger.error(errorMessage);
            throw new Error(errorMessage);
        }

        this._logger.info('Successfully validated configuration.');
    }

    public async checkDependencies(): Promise<void> {
        this._logger.debug('Checking for required dependencies...');

        await this._checkFFmpegInstalled();
        await this._checkNodeJsVersion();

        this._logger.info('Successfully checked required dependencies.');
    }

    public async checkApplicationVersion(): Promise<void> {
        this._logger.debug('Checking application version...');

        const currentVersion = this._packageJson.version;
        const latestVersion = await this._fetchLatestVersion();

        this._logger.debug(`Current version is ${currentVersion}`);

        if (latestVersion === 'undefined') {
            this._logger.warn('Failed to fetch the latest version from GitHub.');
        } else if (latestVersion !== currentVersion) {
            this._logger.warn(`New version available: ${latestVersion}`);
            this._logger.warn(`You are currently using version: ${currentVersion}`);
            this._logger.warn("Please consider updating the application with 'git pull'.");
        }

        this._logger.info('Successfully checked application version.');
    }

    private async _fetchLatestVersion(): Promise<string> {
        const repoIdentifier = this._packageJson.repository.url.split('/').slice(-2).join('/');
        try {
            const response = await this._fetch(`https://api.github.com/repos/${repoIdentifier}/releases/latest`);
            const data = await response.json();
            return data.tag_name || 'undefined';
        } catch {
            this._logger.warn('Failed to fetch the latest version from GitHub.');
            return 'undefined';
        }
    }

    private _validateYouTubeAuthTokens(): void {
        const ytAuthTokens = this._getYouTubeAuthTokens();
        if (ytAuthTokens.length > 0) {
            for (const [index, token] of ytAuthTokens.entries()) {
                if (!token.startsWith('access_token=') || !token.includes('token_type')) {
                    this._logger.warn(`YT_EXTRACTOR_AUTH token at index ${index} is not valid. This is required for the YouTube extractor to work properly.`);
                }
            }

            this._logger.debug(`Found ${ytAuthTokens.length} valid YT_EXTRACTOR_AUTH tokens.`);
        } else {
            this._logger.warn('YT_EXTRACTOR_AUTH token is not set. This is required for the YouTube extractor to work properly.');
        }
    }

    private _getYouTubeAuthTokens(): string[] {
        return Object.keys(process.env)
            .filter((key) => key.startsWith('YT_EXTRACTOR_AUTH'))
            .map((key) => process.env[key])
            .filter((value): value is string => value !== undefined);
    }

    private async _checkFFmpegInstalled(): Promise<void> {
        try {
            await this._runCommand('ffmpeg -version')
            this._logger.debug('FFmpeg is installed.');
        } catch (error) {
            this._logger.error('FFmpeg is not installed on your system.');
            this._logger.error('Make sure you have FFmpeg installed and try again.');
            this._logger.error('If you are using Windows, make sure to add FFmpeg to your PATH.');
            this._logger.error('Exiting...');
            throw error
        }

    }

    private async _checkNodeJsVersion(): Promise<void> {
        try {
            const version = await this._runCommand('node -v');
            const majorVersion = Number.parseInt(version.split('.')[0].replace('v', ''), 10);

            this._logger.debug(`Detected Node.js version: ${version.trim()}`);

            if (majorVersion < 20) {
                this._logger.warn('Node.js version is below supported version 20. Please consider upgrading to LTS version.');
            }
        } catch {
            const errorMessage = 'An error occurred while checking Node.js version. Exiting...';
            this._logger.error(errorMessage);
            throw new Error(errorMessage);
        }
    }

    private _runCommand(command: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this._execute(command, (error, stdout) => {
                if (error) {
                    reject(error);
                    process.exit(1);
                } else {
                    resolve(stdout.trim());
                }
            });
        });
    }
}
