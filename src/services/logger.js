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

const transport = pino.transport({ targets });

const logLevelConfig = {
    level: loggerOptions.minimumLogLevel,
    timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
    base: undefined
};

module.exports = pino(logLevelConfig, transport);
