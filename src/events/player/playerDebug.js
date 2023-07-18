const logger = require('../../services/logger');

module.exports = {
    name: 'error',
    isDebug: true,
    isPlayerEvent: true,
    execute: async (message) => {
        logger.trace(message);
    }
};
