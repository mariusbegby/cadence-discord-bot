// Load environment variables from .env file
import 'dotenv/config';

// Import modules
import type { ShardManagerConfig, HealthCheckConfig } from '@config/types';
import { CoreValidator } from '@core/CoreValidator';
import { ShardManager } from '@core/ShardManager';
import { StorageClientHealth } from '@services/insights/health-checks/StorageClientHealth';
import { HealthCheckService } from '@services/insights/HealthCheckService';
import { useLogger } from '@services/insights/LoggerService';
import { StorageClient } from '@services/storage/StorageClient';
import config from 'config';

// Initialize services
const logger = useLogger();
logger.setContext({ module: 'core' });
const storageClient = new StorageClient(logger);
const healthCheckService = new HealthCheckService(logger);
healthCheckService.registerHealthCheck(new StorageClientHealth(storageClient));

// Initialize core components
const shardManagerConfig = config.get<ShardManagerConfig>('shardManagerConfig');
const healthCheckConfig = config.get<HealthCheckConfig>('healthCheckConfig');
const coreValidator = new CoreValidator(logger);
const shardManager = new ShardManager(logger, shardManagerConfig);

// Application startup logic
const startApplication = async (): Promise<void> => {
    logger.info('Starting application...');
    await coreValidator.validateConfiguration();
    await coreValidator.checkDependencies();
    await shardManager.start();
    await healthCheckService.start(healthCheckConfig.interval);

    logger.info('Application started successfully.');
};

// Start the application
try {
    startApplication();
} catch (error: unknown) {
    logger.error(error, 'An error occurred while starting the application.');
    process.exit(1);
}
