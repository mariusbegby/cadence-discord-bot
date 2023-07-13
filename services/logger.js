const pino = require('pino');
require('dotenv').config();

const transport = pino.transport({
    targets: [
        {
            target: 'pino/file',
            level: 'debug',
            options: { destination: `./app-debug.log` }
        },
        {
            target: 'pino/file',
            level: 'info',
            options: { destination: `./app-info.log` }
        },
        {
            target: 'pino/file',
            level: 'error',
            options: { destination: `./app-error.log` }
        },
        {
            level: process.env.MINIMUM_LOG_LEVEL_CONSOLE,
            target: 'pino-pretty'
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
