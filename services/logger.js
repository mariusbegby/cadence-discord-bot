const pino = require('pino');
const { minimumLogLevel } = require('../config.json');

module.exports = pino({
    level: minimumLogLevel,
    transport: {
        target: 'pino-pretty',
        options: {
            ignore: 'pid,hostname'
        }
    }
});
