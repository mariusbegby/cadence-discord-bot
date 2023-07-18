const logger = require('../../services/logger');

module.exports = {
    name: 'unhandledRejection',
    isDebug: false,
    execute: async (error) => {
        logger.fatal(error, 'UNHANDLED REJECTION ERROR:');
        return;
    }
};
