// Load environment variables from .env file
import 'dotenv/config';

// Import modules
import type { HealthCheckConfig, ShardManagerConfig } from '@config/types';
import { CoreValidator } from '@core/CoreValidator';
import { ShardManager } from '@core/ShardManager';
import { StorageClientHealth } from '@services/insights/health-checks/StorageClientHealth';
import { HealthCheckService } from '@services/insights/HealthCheckService';
import { useLogger } from '@services/insights/LoggerService';
import { StorageClient } from '@services/storage/StorageClient';
import '@utilities/FormattingUtility';
import config from 'config';
import { performance, PerformanceObserver } from 'perf_hooks';

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

// TESTING - Performance Observer
// Will be integrated into the metrics service later
const obs = new PerformanceObserver((items) => {
    items.getEntries().forEach((entry) => {
        if (!entry.name.includes('benchmark')) {
            logger.info(`Performance Observer: ${entry.name} - ${entry.duration.toFixed(2)}ms`);
        }
    });
});
obs.observe({ type: 'measure' });

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
    performance.mark('startApplication:start');
    startApplication();
    performance.mark('startApplication:end');
    performance.measure('startApplication', 'startApplication:start', 'startApplication:end');
} catch (error: unknown) {
    logger.error(error, 'An error occurred while starting the application.');
    process.exit(1);
}
