import { CoreValidator } from '@core/CoreValidator';
import { MockLoggerService } from '@mocks/MockLoggerService';
import { IConfig } from 'config';
import type { exec } from 'child_process';
import type { HealthCheckConfig, ShardManagerConfig, LoggerServiceConfig } from '@config/types';

describe('CoreValidator', () => {
    let mockLoggerService = new MockLoggerService();
    let mockConfig: Partial<IConfig>;
    let mockExecute: Partial<typeof exec>;
    let mockLoadedConfiguration: {
        shardManagerConfig?: ShardManagerConfig;
        loggerServiceConfig?: LoggerServiceConfig;
        healthCheckConfig?: HealthCheckConfig;
    };
    let coreValidator: CoreValidator;

    function updateTestSetup() {
        if (!mockLoadedConfiguration) {
            mockLoadedConfiguration = {
                shardManagerConfig: {} as ShardManagerConfig,
                loggerServiceConfig: {} as LoggerServiceConfig,
                healthCheckConfig: {} as HealthCheckConfig
            };
        }

        if (!mockConfig) {
            mockConfig = {
                util: {
                    loadFileConfigs: jest.fn().mockReturnValue(mockLoadedConfiguration),
                    extendDeep: jest.fn(),
                    cloneDeep: jest.fn(),
                    setPath: jest.fn(),
                    equalsDeep: jest.fn(),
                    diffDeep: jest.fn(),
                    makeHidden: jest.fn(),
                    makeImmutable: jest.fn(),
                    getEnv: jest.fn(),
                    getConfigSources: jest.fn(),
                    toObject: jest.fn(),
                    setModuleDefaults: jest.fn()
                }
            };
        }

        if (!mockExecute) {
            mockExecute = jest.fn((command, callback) => {
                if (callback) {
                    callback(null, `Dependency check for ${command} passed`, '');
                }
            }) as unknown as typeof exec;
        }

        coreValidator = new CoreValidator(mockLoggerService, mockConfig as IConfig, mockExecute as typeof exec);
    }

    // create mock of exec function
    jest.mock('child_process', () => {
        return {
            exec: jest.fn((command, callback) => {
                if (callback) {
                    callback(null, `Dependency check for ${command} passed`, '');
                }
            }) as unknown as typeof exec
        };
    });

    beforeEach(() => {
        jest.clearAllMocks();
        process.exit = jest.fn() as unknown as typeof process.exit;
        // mock process.exit to prevent the application from exiting but still stop execution
        process.exit = jest.fn().mockImplementation(() => {
            throw new Error('[MOCK] process.exit() called');
        }) as unknown as typeof process.exit;

        delete process.env.NODE_ENV;
        delete process.env.DISCORD_BOT_TOKEN;
        delete process.env.DISCORD_APPLICATION_ID;
        delete process.env.TOTAL_SHARDS;
        delete process.env.YT_EXTRACTOR_AUTH;
        delete process.env.YT_EXTRACTOR_AUTH_1;
        delete process.env.YT_EXTRACTOR_AUTH_2;

        mockLoggerService = new MockLoggerService();
        updateTestSetup();
    });

    describe('validateConfiguration', () => {
        it('should validate the configuration', async () => {
            // Arrange
            mockLoadedConfiguration = {
                shardManagerConfig: {} as ShardManagerConfig,
                loggerServiceConfig: {} as LoggerServiceConfig,
                healthCheckConfig: {} as HealthCheckConfig
            };
            updateTestSetup();

            // Act
            await coreValidator.validateConfiguration();

            // Assert
            expect(mockLoggerService.debug).toHaveBeenCalledWith('Validating configuration...');
            expect(mockLoggerService.debug).toHaveBeenCalledWith(mockLoadedConfiguration, 'Using configuration:');
            expect(mockLoggerService.error).not.toHaveBeenCalled();
            expect(mockLoggerService.info).toHaveBeenCalledWith('Successfully validated configuration.');
        });

        it('should throw an error if a required configuration option is missing', async () => {
            // Arrange
            const loadedConfiguration = {
                shardManagerConfig: {}
            };
            mockConfig = {
                util: {
                    loadFileConfigs: jest.fn().mockReturnValue(loadedConfiguration),
                    extendDeep: jest.fn(),
                    cloneDeep: jest.fn(),
                    setPath: jest.fn(),
                    equalsDeep: jest.fn(),
                    diffDeep: jest.fn(),
                    makeHidden: jest.fn(),
                    makeImmutable: jest.fn(),
                    getEnv: jest.fn(),
                    getConfigSources: jest.fn(),
                    toObject: jest.fn(),
                    setModuleDefaults: jest.fn()
                }
            };
            updateTestSetup();

            // Act
            await expect(coreValidator.validateConfiguration()).rejects.toThrow(
                'Missing the following required configuration options: loggerServiceConfig, healthCheckConfig.'
            );

            // Assert
            expect(mockLoggerService.debug).toHaveBeenCalledWith('Validating configuration...');
            expect(mockLoggerService.debug).toHaveBeenCalledWith(loadedConfiguration, 'Using configuration:');
            expect(mockLoggerService.error).toHaveBeenCalledWith(
                'Missing the following required configuration options: loggerServiceConfig, healthCheckConfig.'
            );
            expect(mockLoggerService.info).not.toHaveBeenCalled();
        });
    });

    describe('checkDependencies', () => {
        it('should check for required dependencies', async () => {
            // Act
            await coreValidator.checkDependencies();

            // Assert
            expect(mockLoggerService.debug).toHaveBeenCalledWith('Checking for required dependencies...');
            expect(mockLoggerService.error).not.toHaveBeenCalled();
            expect(mockLoggerService.info).toHaveBeenCalledWith('Successfully checked required dependencies.');
        });

        it('should throw an error if a ffmpeg is missing', async () => {
            // Arrange
            mockExecute = jest.fn((command, callback) => {
                if (callback) {
                    if (command === 'ffmpeg -version') {
                        callback(new Error(`Dependency check for ${command} failed`), null, '');
                    } else {
                        callback(null, `Dependency check for ${command} passed`, '');
                    }
                }
            }) as unknown as typeof exec;

            updateTestSetup();

            // Act
            await expect(coreValidator.checkDependencies()).rejects.toThrow(
                'Dependency check for ffmpeg -version failed'
            );

            // Assert
            expect(mockLoggerService.debug).toHaveBeenCalledWith('Checking for required dependencies...');
            expect(mockLoggerService.error).toHaveBeenCalledWith('FFmpeg is not installed on your system.');
            expect(mockLoggerService.error).toHaveBeenCalledWith('Make sure you have FFmpeg installed and try again.');
            expect(mockLoggerService.error).toHaveBeenCalledWith(
                'If you are using Windows, make sure to add FFmpeg to your PATH.'
            );
            expect(mockLoggerService.info).not.toHaveBeenCalled();
        });

        it('should warn if running non-supported Node.js version', async () => {
            // Arrange
            mockExecute = jest.fn((command, callback) => {
                if (callback) {
                    if (command === 'node -v') {
                        callback(null, 'v18.0.0-TEST', '');
                    } else {
                        callback(null, `Dependency check for ${command} passed`, '');
                    }
                }
            }) as unknown as typeof exec;

            updateTestSetup();

            // Act
            await coreValidator.checkDependencies();

            // Assert
            expect(mockLoggerService.debug).toHaveBeenCalledWith('Checking for required dependencies...');
            expect(mockLoggerService.debug).toHaveBeenCalledWith('Detected Node.js version: v18.0.0-TEST');
            expect(mockLoggerService.warn).toHaveBeenCalledWith(
                'Node.js version is below supported version 20. Please consider upgrading to LTS version.'
            );
            expect(mockLoggerService.error).not.toHaveBeenCalled();
            expect(mockLoggerService.info).toHaveBeenCalledWith('Successfully checked required dependencies.');
        });

        it('should log error if error occurs while checking Node.js version', async () => {
            // Arrange
            mockExecute = jest.fn((command, callback) => {
                if (callback) {
                    if (command === 'node -v') {
                        callback(new Error('An error occurred'), null, '');
                    } else {
                        callback(null, `Dependency check for ${command} passed`, '');
                    }
                }
            }) as unknown as typeof exec;

            updateTestSetup();

            // Act
            await expect(coreValidator.checkDependencies()).rejects.toThrow('An error occurred');

            // Assert
            expect(mockLoggerService.debug).toHaveBeenCalledWith('Checking for required dependencies...');
            expect(mockLoggerService.error).toHaveBeenCalledWith(
                'An error occurred while checking Node.js version. Exiting...'
            );
            expect(mockLoggerService.info).not.toHaveBeenCalled();
        });
    });

    describe('validateEnvironmentVariables', () => {
        it('should validate the environment variables', async () => {
            // Arrange
            // mock environment variables
            process.env.NODE_ENV = 'development';
            process.env.DISCORD_BOT_TOKEN = 'bot-token';
            process.env.DISCORD_APPLICATION_ID = '12345';
            process.env.TOTAL_SHARDS = 'AUTO';

            // Act
            await coreValidator.validateEnvironmentVariables();

            // Assert
            expect(mockLoggerService.debug).toHaveBeenCalledWith('Validating environment variables...');
            expect(mockLoggerService.debug).toHaveBeenCalledWith('NODE_ENV is set to development.');
            expect(mockLoggerService.debug).toHaveBeenCalledWith('DISCORD_BOT_TOKEN is set.');
            expect(mockLoggerService.debug).toHaveBeenCalledWith('DISCORD_APPLICATION_ID is set.');
            expect(mockLoggerService.debug).toHaveBeenCalledWith('TOTAL_SHARDS is set to AUTO.');
            expect(mockLoggerService.error).not.toHaveBeenCalled();
            expect(mockLoggerService.info).toHaveBeenCalledWith('Successfully validated environment variables.');
        });

        it('should throw an error if NODE_ENV is not set to development or production', async () => {
            // Arrange
            process.env.NODE_ENV = 'test';
            process.env.DISCORD_BOT_TOKEN = 'bot-token';
            process.env.DISCORD_APPLICATION_ID = '12345';
            process.env.TOTAL_SHARDS = 'AUTO';

            // Act
            await expect(coreValidator.validateEnvironmentVariables()).rejects.toThrow('[MOCK] process.exit() called');

            // Assert
            expect(mockLoggerService.debug).toHaveBeenCalledWith('Validating environment variables...');
            expect(mockLoggerService.error).toHaveBeenCalledWith(
                'NODE_ENV is not set to development or production. Please set it to either of these values. Exiting...'
            );
            expect(mockLoggerService.info).not.toHaveBeenCalled();
        });

        it('should throw an error if DISCORD_BOT_TOKEN is not set', async () => {
            // Arrange
            process.env.NODE_ENV = 'development';
            process.env.DISCORD_BOT_TOKEN = '';
            process.env.DISCORD_APPLICATION_ID = '12345';
            process.env.TOTAL_SHARDS = 'AUTO';

            // Act
            await expect(coreValidator.validateEnvironmentVariables()).rejects.toThrow('[MOCK] process.exit() called');

            // Assert
            expect(mockLoggerService.debug).toHaveBeenCalledWith('Validating environment variables...');
            expect(mockLoggerService.error).toHaveBeenCalledWith(
                'Missing the following required environment variables: DISCORD_BOT_TOKEN. Exiting...'
            );
            expect(mockLoggerService.info).not.toHaveBeenCalled();
        });

        it('should throw an error if DISCORD_APPLICATION_ID is not set', async () => {
            // Arrange
            process.env.NODE_ENV = 'development';
            process.env.DISCORD_BOT_TOKEN = 'bot-token';
            process.env.DISCORD_APPLICATION_ID = '';
            process.env.TOTAL_SHARDS = 'AUTO';

            // Act
            await expect(coreValidator.validateEnvironmentVariables()).rejects.toThrow('[MOCK] process.exit() called');

            // Assert
            expect(mockLoggerService.debug).toHaveBeenCalledWith('Validating environment variables...');
            expect(mockLoggerService.error).toHaveBeenCalledWith(
                'Missing the following required environment variables: DISCORD_APPLICATION_ID. Exiting...'
            );
            expect(mockLoggerService.info).not.toHaveBeenCalled();
        });

        it('should throw an error when multiple environment variables are missing', async () => {
            // Arrange
            process.env.NODE_ENV = '';
            process.env.DISCORD_BOT_TOKEN = '';
            process.env.DISCORD_APPLICATION_ID = '';
            process.env.TOTAL_SHARDS = 'AUTO';

            // Act
            await expect(coreValidator.validateEnvironmentVariables()).rejects.toThrow('[MOCK] process.exit() called');

            // Assert
            expect(mockLoggerService.debug).toHaveBeenCalledWith('Validating environment variables...');
            expect(mockLoggerService.error).toHaveBeenCalledWith(
                'Missing the following required environment variables: NODE_ENV, DISCORD_BOT_TOKEN, DISCORD_APPLICATION_ID. Exiting...'
            );
            expect(mockLoggerService.info).not.toHaveBeenCalled();
        });

        it('should throw an error if TOTAL_SHARDS is not set to AUTO or a valid number', async () => {
            // Arrange
            process.env.NODE_ENV = 'development';
            process.env.DISCORD_BOT_TOKEN = 'bot-token';
            process.env.DISCORD_APPLICATION_ID = '12345';
            process.env.TOTAL_SHARDS = 'test';

            // Act
            await expect(coreValidator.validateEnvironmentVariables()).rejects.toThrow('[MOCK] process.exit() called');

            // Assert
            expect(mockLoggerService.debug).toHaveBeenCalledWith('Validating environment variables...');
            expect(mockLoggerService.error).toHaveBeenCalledWith(
                'TOTAL_SHARDS is not set to AUTO or a valid number. Please set it to AUTO or the total number of shards. Exiting...'
            );
            expect(mockLoggerService.info).not.toHaveBeenCalled();
        });

        it('should log a warning if YT_EXTRACTOR_AUTH is not set', async () => {
            // Arrange
            process.env.NODE_ENV = 'development';
            process.env.DISCORD_BOT_TOKEN = 'bot-token';
            process.env.DISCORD_APPLICATION_ID = '12345';
            process.env.TOTAL_SHARDS = 'AUTO';
            delete process.env.YT_EXTRACTOR_AUTH;

            // Act
            await coreValidator.validateEnvironmentVariables();

            // Assert
            expect(mockLoggerService.debug).toHaveBeenCalledWith('Validating environment variables...');
            expect(mockLoggerService.warn).toHaveBeenCalledWith(
                'YT_EXTRACTOR_AUTH token is not set. This is required for the YouTube extractor to work properly.'
            );
            expect(mockLoggerService.error).not.toHaveBeenCalled();
            expect(mockLoggerService.info).toHaveBeenCalledWith('Successfully validated environment variables.');
        });

        it('should log a warning if any YT_EXTRACTOR_AUTH is not valid', async () => {
            // Arrange
            process.env.NODE_ENV = 'development';
            process.env.DISCORD_BOT_TOKEN = 'bot-token';
            process.env.DISCORD_APPLICATION_ID = '12345';
            process.env.TOTAL_SHARDS = 'AUTO';
            process.env.YT_EXTRACTOR_AUTH_1 = 'auth-token-1';
            process.env.YT_EXTRACTOR_AUTH_2 = 'auth-token-2';

            // Act
            await coreValidator.validateEnvironmentVariables();

            // Assert
            expect(mockLoggerService.debug).toHaveBeenCalledWith('Validating environment variables...');
            expect(mockLoggerService.warn).toHaveBeenCalledWith(
                'YT_EXTRACTOR_AUTH token at index 0 is not valid. This is required for the YouTube extractor to work properly.'
            );
            expect(mockLoggerService.warn).toHaveBeenCalledWith(
                'YT_EXTRACTOR_AUTH token at index 1 is not valid. This is required for the YouTube extractor to work properly.'
            );
            expect(mockLoggerService.error).not.toHaveBeenCalled();
            expect(mockLoggerService.info).toHaveBeenCalledWith('Successfully validated environment variables.');
        });

        it('should log amount of valid YT_EXTRACTOR_AUTH tokens', async () => {
            // Arrange
            process.env.NODE_ENV = 'development';
            process.env.DISCORD_BOT_TOKEN = 'bot-token';
            process.env.DISCORD_APPLICATION_ID = '12345';
            process.env.TOTAL_SHARDS = 'AUTO';
            process.env.YT_EXTRACTOR_AUTH_1 = 'access_token=something&token_type=something';
            process.env.YT_EXTRACTOR_AUTH_2 = 'access_token=something&token_type=something';

            // Act
            await coreValidator.validateEnvironmentVariables();

            // Assert
            expect(mockLoggerService.debug).toHaveBeenCalledWith('Validating environment variables...');
            expect(mockLoggerService.debug).toHaveBeenCalledWith('Found 2 valid YT_EXTRACTOR_AUTH tokens.');
            expect(mockLoggerService.error).not.toHaveBeenCalled();
            expect(mockLoggerService.info).toHaveBeenCalledWith('Successfully validated environment variables.');
        });
    });
});
