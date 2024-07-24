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
            expect(mockLoggerService.error).toHaveBeenCalledWith('An error occurred while checking Node.js version.');
            expect(mockLoggerService.info).not.toHaveBeenCalled();
        });
    });
});
