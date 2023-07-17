const pino = require('pino');
require('dotenv').config();

const transport = pino.transport({
    targets: [
        {
            target: 'pino/file',
            level: process.env.MINIMUM_LOG_LEVEL,
            options: {
                destination: './logs/app-all.log',
                mkdir: true,
                sync: false,
                minLength: 4096
            }
        },
        {
            target: 'pino/file',
            level: 'info',
            options: {
                destination: './logs/app-info.log',
                mkdir: true,
                sync: false,
                minLength: 4096
            }
        },
        {
            target: 'pino/file',
            level: 'error',
            options: {
                destination: './logs/app-error.log',
                mkdir: true,
                sync: false
            }
        },
        {
            target: 'pino/file',
            level: process.env.MINIMUM_LOG_LEVEL_CONSOLE,
            options: {
                colorize: true,
                sync: false
            }
        }
    ]
});

module.exports = pino(
    {
        level: process.env.MINIMUM_LOG_LEVEL,
        timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
        base: undefined
    },
    transport
);
