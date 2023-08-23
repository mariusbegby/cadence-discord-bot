const pino = require('pino');
const config = require('config');
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

if (process.env.LOKI_AUTH_PASSWORD && process.env.LOKI_AUTH_USERNAME) {
    targets.push({
        target: 'pino-loki',
        level: loggerOptions.minimumLogLevel,
        options: {
            sync: false,
            batching: false,
            interval: 5,

            host: 'https://logs-prod-025.grafana.net',
            basicAuth: {
                username: process.env.LOKI_AUTH_USERNAME || '',
                password: process.env.LOKI_AUTH_PASSWORD || ''
            }
        }
    });
}

const transport = pino.transport({ targets });

const logLevelConfig = {
    level: loggerOptions.minimumLogLevel,
    timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
    base: undefined
};

module.exports = pino(logLevelConfig, transport);
