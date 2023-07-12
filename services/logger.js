const pino = require('pino');
const { minimumLogLevel, minimumLogLevelConsole } = require('../config.json');

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
            level: minimumLogLevelConsole,
            target: 'pino-pretty'
        }
    ]
});

module.exports = pino(
    {
        level: minimumLogLevel,
        timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
        base: undefined
    },
    transport
);
