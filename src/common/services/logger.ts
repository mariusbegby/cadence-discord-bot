/* eslint-disable no-console */
import config from 'config';
import pino, { type DestinationStream, type Logger as PinoLogger, type LoggerOptions } from 'pino';
import type { CustomLoggerOptions } from '../../types/configTypes';
import type { TargetOptions } from '../../types/serviceTypes';

// Retrieve logger options from config
const loggerOptions: CustomLoggerOptions = config.get('loggerOptions');

const targets: TargetOptions[] = [
    {
        // This target is used for logging everything above specified minimumLogLevel
        target: 'pino/file',
        level: loggerOptions.minimumLogLevel,
        options: {
            destination: './logs/app-all.log',
            mkdir: true,
            sync: false
        }
    },
    {
        // This target is used for logging errors separately
        target: 'pino/file',
        level: 'error',
        options: {
            destination: './logs/app-error.log',
            mkdir: true,
            sync: false
        }
    }
];

// Add console logging with pino-pretty if available
let pinoPrettyAvailable = false;

try {
    require.resolve('pino-pretty');
    pinoPrettyAvailable = true;
} catch (e) {
    console.error(e);
    console.log('pino-pretty not available. Falling back to default console logging.');
    console.log('install pino-pretty for better console logging: npm i pino-pretty');
}

if (pinoPrettyAvailable) {
    targets.push({
        target: 'pino-pretty',
        level: loggerOptions.minimumLogLevelConsole,
        options: {
            colorize: true,
            ignore: 'environment,source,module,action,name,context,executionId,executionTime,shardId,guildId,interactionType'
        }
    });
} else {
    targets.push({
        // This target is used for logging to the console
        target: 'pino/file',
        level: loggerOptions.minimumLogLevelConsole,
        options: {
            colorize: true,
            sync: false
        }
    });
}

const transport: DestinationStream = pino.transport({ targets });

// Default properties for the logger, these will be added to every log entry
const defaultProperties: object = {
    environment: process.env.NODE_ENV || 'development'
};

const logLevelConfig: LoggerOptions = {
    level: loggerOptions.minimumLogLevel,
    timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
    base: defaultProperties
};

export type Logger = PinoLogger;
export const loggerService: Logger = pino(logLevelConfig, transport);
export default loggerService;
