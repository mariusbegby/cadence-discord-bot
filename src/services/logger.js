const pino = require('pino');
const config = require('config');

// Retrieve logger options from config
const loggerOptions = config.get('loggerOptions');

const targets = [
    {
        target: 'pino/file',
        level: loggerOptions.minimumLogLevel,
        options: {
            destination: './logs/app-all.log',
            mkdir: true,
            sync: false,
            minLength: 4096
        }
    },
    {
        target: 'pino/file',
        level: pino.levels.values.info,
        options: {
            destination: './logs/app-info.log',
            mkdir: true,
            sync: false,
            minLength: 4096
        }
    },
    {
        target: 'pino/file',
        level: pino.levels.values.error,
        options: {
            destination: './logs/app-error.log',
            mkdir: true,
            sync: false
        }
    },
    {
        target: 'pino/file',
        level: loggerOptions.minimumLogLevelConsole,
        options: {
            colorize: true,
            sync: false
        }
    }
];

// Check for Loki credentials and add Loki as a target if present
if (process.env.LOKI_AUTH_PASSWORD && process.env.LOKI_AUTH_USERNAME) {
    targets.push({
        target: 'pino-loki',
        level: loggerOptions.minimumLogLevel,
        options: {
            sync: false,
            batching: false,
            interval: 5,
            host: process.env.LOKI_HOST || 'http://localhost:3100',
            basicAuth: {
                username: process.env.LOKI_AUTH_USERNAME || '',
                password: process.env.LOKI_AUTH_PASSWORD || ''
            }
        }
    });
}

const transport = pino.transport({ targets });

// Default properties for the logger, these will be added to every log entry
const defaultProperties = {
    environment: process.env.NODE_ENV || 'development'
};

const logLevelConfig = {
    level: loggerOptions.minimumLogLevel,
    timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
    base: defaultProperties
};

const logger = pino(logLevelConfig, transport);

module.exports = logger;
