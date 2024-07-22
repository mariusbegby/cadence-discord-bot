// Load environment variables from .env file
import 'dotenv/config';

// Import modules
import config from 'config';
import { type ShardManagerConfig } from '../config/types';
import { ShardingManager } from './core/ShardManager';
import { createLogger, type Logger } from './services/insights/LoggerService';
import { MetricService } from './services/insights/MetricService';
import { CoreValidator } from './validation/configuration/CoreValidator';

// Retrieve configuration
const shardManagerConfig = config.get<ShardManagerConfig>('shardManagerConfig');

// Initialize insights services
const logger: Logger = createLogger({ location: __filename });
const metricService = new MetricService(logger);

// Initialize core components
const coreValidator = new CoreValidator();
const shardManager = new ShardingManager(metricService, shardManagerConfig);

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
