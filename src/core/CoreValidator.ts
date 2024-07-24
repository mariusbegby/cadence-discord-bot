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

export class CoreValidator implements ICoreValidator {
    _logger: ILoggerService;
    _config: IConfig;
    _execute: typeof exec;

    constructor(logger: ILoggerService, config: IConfig, execute: typeof exec) {
        this._logger = logger;
        this._config = config;
        this._execute = execute;
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

    private async checkFFmpegInstalled() {
        await new Promise<void>((resolve, reject) => {
            this._execute('ffmpeg -version', (error) => {
                if (error) {
                    this._logger.error('FFmpeg is not installed on your system.');
                    this._logger.error('Make sure you have FFmpeg installed and try again.');
                    this._logger.error('If you are using Windows, make sure to add FFmpeg to your PATH.');
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
                    this._logger.error('An error occurred while checking Node.js version.');
                    reject(error);
                    process.exit(1);
                } else {
                    const nodeVersionString = stdout.trim();
                    const nodeVersionArray = nodeVersionString.split('.').map((n) => parseInt(n.replace('v', '')));
                    this._logger.debug(`Detected Node.js version: ${nodeVersionString}`);

                    let nodeMajorVersion = nodeVersionArray[0];
                    if (typeof nodeMajorVersion !== 'number' || isNaN(nodeMajorVersion)) {
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
