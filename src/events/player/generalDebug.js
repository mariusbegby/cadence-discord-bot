const path = require('node:path');
const logger = require(path.resolve('./src/services/logger.js'));
require('dotenv').config();

module.exports = {
    name: 'debug',
    isDebug: true,
    isPlayerEvent: false,
    execute: async (message) => {
        logger.debug(message);
    }
};
