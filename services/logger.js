const pino = require('pino');
require('dotenv').config();

const transport = pino.transport({
    targets: [
        {
            target: 'pino/file',
            level: process.env.MINIMUM_LOG_LEVEL,
            options: {
                destination: './app-all.log',
                sync: false,
                minLength: 4096
            }
        },
        {
            target: 'pino/file',
            level: 'info',
            options: {
                destination: './app-info.log',
                sync: false,
                minLength: 4096
            }
        },
        {
            target: 'pino/file',
            level: 'error',
            options: {
                destination: './app-error.log',
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
