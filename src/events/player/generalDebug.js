const logger = require('../../services/logger');

module.exports = {
    name: 'debug',
    isDebug: true,
    isPlayerEvent: false,
    execute: async (message) => {
        logger.debug(message);
    }
};
