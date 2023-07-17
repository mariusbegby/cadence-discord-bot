const path = require('node:path');
const logger = require(path.resolve('./src/services/logger.js'));

module.exports = {
    name: 'error',
    isDebug: true,
    isPlayerEvent: true,
    execute: async (message) => {
        logger.trace(message);
    }
};
