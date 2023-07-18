const logger = require('../../services/logger');

module.exports = {
    name: 'playerStart',
    isDebug: true,
    isPlayerEvent: true,
    execute: async (queue, track) => {
        logger.debug(`playerStart event: Started playing '${track.raw.source}'.`);
        process.env.NODE_ENV === 'development' ? logger.trace(queue) : null;
    }
};
