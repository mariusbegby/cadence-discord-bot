const { v4: uuidv4 } = require('uuid');

module.exports = {
    name: 'unhandledRejection',
    isDebug: false,
    execute: async (error) => {
        const executionId = uuidv4();

        const logger = require('../../services/logger').child({
            source: 'unhandledRejection.js',
            module: 'event',
            name: 'unhandledRejection',
            executionId: executionId
        });

        logger.fatal(error, 'UNHANDLED REJECTION ERROR:');
        return;
    }
};
