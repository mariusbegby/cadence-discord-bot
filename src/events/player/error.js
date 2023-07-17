const path = require('node:path');
const logger = require(path.resolve('./src/services/logger.js'));
require('dotenv').config();

// Emitted when the player queue encounters error
module.exports = {
    name: 'error',
    isDebug: false,
    isPlayerEvent: true,
    execute: async (queue, error) => {
        logger.error(error, 'Player queue error event');
        process.env.NODE_ENV === 'development' ? logger.trace(queue) : null;
    }
};
