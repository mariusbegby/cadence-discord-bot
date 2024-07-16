/* eslint-disable no-console */
import config from 'config';
import pino, { DestinationStream, Logger as PinoLogger, LoggerOptions } from 'pino';
import { CustomLoggerOptions } from '../../types/configTypes';
import { TargetOptions } from '../../types/serviceTypes';

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
let pinoLokiAvailable = false;

try {
    require.resolve('pino-pretty');
    pinoPrettyAvailable = true;
} catch (e) {
    console.error(e);
    console.log('pino-pretty not available. Falling back to default console logging.');
    console.log('install pino-pretty for better console logging: npm i pino-pretty');
}

try {
    require.resolve('pino-loki');
    pinoLokiAvailable = true;
} catch (e) {
    console.error(e);
    console.log('pino-loki not available. Sending logs to Grafana Loki will be skipped.');
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

// Check for Loki credentials and add Loki as a target if present and pino-loki is installed
if (pinoLokiAvailable && process.env.LOKI_AUTH_PASSWORD && process.env.LOKI_AUTH_USERNAME) {
    targets.push({
        target: 'pino-loki',
        level: loggerOptions.minimumLogLevel,
        options: {
            sync: false,
            batching: false,
            interval: 5,

            // Loki host and credentials are retrieved from environment variables
            host: process.env.LOKI_HOST || 'http://localhost:3100',
            basicAuth: {
                username: process.env.LOKI_AUTH_USERNAME || '',
                password: process.env.LOKI_AUTH_PASSWORD || ''
            }
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
