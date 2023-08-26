const { v4: uuidv4 } = require('uuid');

module.exports = {
    name: 'uncaughtException',
    isDebug: false,
    execute: async (error) => {
        const executionId = uuidv4();

        const logger = require('../../services/logger').child({
            source: 'uncaughtException.js',
            module: 'event',
            name: 'uncaughtException',
            executionId: executionId
        });

        logger.fatal(error, 'UNCAUGHT EXCEPTION ERROR:');
        return;
    }
};
