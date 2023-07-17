const path = require('node:path');
const logger = require(path.resolve('./src/services/logger.js'));
require('dotenv').config();

module.exports = {
    name: 'unhandledRejection',
    isDebug: false,
    execute: async (error) => {
        logger.fatal(error, 'UNHANDLED REJECTION ERROR:');
        return;
    }
};
