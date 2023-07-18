const logger = require('../../services/logger');

module.exports = {
    name: 'uncaughtException',
    isDebug: false,
    execute: async (error) => {
        logger.fatal(error, 'UNCAUGHT EXCEPTION ERROR:');
        return;
    }
};
