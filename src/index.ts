// Load environment variables from .env file
import 'dotenv/config';

// Import modules
import config from 'config';
import type { ShardManagerConfig } from '../config/types';
import { CoreValidator } from './core/CoreValidator';
import { ShardManager } from './core/ShardManager';
import { LoggerService } from './services/insights/LoggerService';

// Retrieve configuration
const shardManagerConfig = config.get<ShardManagerConfig>('shardManagerConfig');

// Initialize insights services
const logger = new LoggerService();
logger.setContext({ module: 'core' });
//const metricService = new MetricService(logger);

// Initialize core components
const coreValidator = new CoreValidator(logger);
const shardManager = new ShardManager(logger, shardManagerConfig);

// Startup logic
const startApplication = async (): Promise<void> => {
    await coreValidator.validateConfiguration(); // validate environment variables and critical configuration
    await coreValidator.checkDependencies(); // check for required dependencies outside of npm, such as ffmpeg
    await shardManager.start(); // calls manager.spawn() internally, throws if no token etc.
};

// Start the application
try {
    startApplication();
} catch (error: unknown) {
    logger.error(error, 'An error occurred while starting the application.');
    process.exit(1);
}
