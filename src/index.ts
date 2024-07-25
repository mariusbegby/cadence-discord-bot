// Load environment variables from .env file
import 'dotenv/config';
import '@utilities/FormattingUtility';

import config from 'config';
import packageJson from '../package.json';

import { CoreValidator } from '@core/CoreValidator';
import { HealthCheckService } from '@services/insights/HealthCheckService';
import { ShardManager } from '@core/ShardManager';
import { StorageClient } from '@services/storage/StorageClient';
import { StorageClientHealth } from '@services/insights/health-checks/StorageClientHealth';
import { useLogger } from '@services/insights/LoggerService';
import { exec } from 'node:child_process';
import { performance, PerformanceObserver } from 'node:perf_hooks';
import type { HealthCheckConfig, ShardManagerConfig } from '@config/types';

// Initialize services
const logger = useLogger();
const storageClient = new StorageClient(logger);
const healthCheckService = new HealthCheckService(logger);
healthCheckService.registerHealthCheck(new StorageClientHealth(storageClient));

// Initialize core components
const shardManagerConfig = config.get<ShardManagerConfig>('shardManagerConfig');
const healthCheckConfig = config.get<HealthCheckConfig>('healthCheckConfig');
const coreValidator = new CoreValidator(logger, config, exec, fetch, packageJson);
const shardManager = new ShardManager(logger, shardManagerConfig);

// TESTING - Performance Observer
// Will be integrated into the metrics service later
const obs = new PerformanceObserver((items) => {
    for (const entry of items.getEntries()) {
        if (!entry.name.includes('benchmark')) {
            logger.info(`[Metrics] Measurement '${entry.name}' took ${entry.duration.toFixed(2)}ms`);
        }
    }
});
obs.observe({ type: 'measure' });

// Application startup logic
const startApplication = async (): Promise<void> => {
    logger.info('Starting application...');
    await coreValidator.validateEnvironmentVariables();
    await coreValidator.validateConfiguration();
    await coreValidator.checkDependencies();
    await coreValidator.checkApplicationVersion();
    await shardManager.start();
    await healthCheckService.start(healthCheckConfig.interval);

    logger.info('Application started successfully.');
};

// Start the application
try {
    performance.mark('startApplication:start');
    (async () => {
        await startApplication();
    })();
    performance.mark('startApplication:end');
    performance.measure('startApplication', 'startApplication:start', 'startApplication:end');
} catch (error: unknown) {
    logger.error(error, 'An error occurred while starting the application. Exiting...');
    process.exit(1);
}
