const path = require('node:path');
const logger = require(path.resolve('./src/services/logger.js'));
require('dotenv').config();

module.exports = {
    name: 'playerStart',
    isDebug: true,
    isPlayerEvent: true,
    execute: async (queue, track) => {
        logger.debug(`playerStart event: Started playing '${track.raw.source}'.`);
        process.env.NODE_ENV === 'development' ? logger.trace(queue) : null;
    }
};
