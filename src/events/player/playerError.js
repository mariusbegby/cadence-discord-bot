const logger = require('../../services/logger');

module.exports = {
    name: 'error',
    isDebug: false,
    isPlayerEvent: true,
    execute: async (queue, error) => {
        logger.error(error, 'Player queue error event');
        process.env.NODE_ENV === 'development' ? logger.trace(queue) : null;
    }
};
