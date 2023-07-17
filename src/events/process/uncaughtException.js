const path = require('node:path');
const logger = require(path.resolve('./src/services/logger.js'));
require('dotenv').config();

module.exports = {
    name: 'uncaughtException',
    isDebug: false,
    execute: async (error) => {
        logger.fatal(error, 'UNCAUGHT EXCEPTION ERROR:');
        return;
    }
};
