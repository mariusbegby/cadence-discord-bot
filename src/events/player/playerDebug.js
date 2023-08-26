const { v4: uuidv4 } = require('uuid');

module.exports = {
    name: 'error',
    isDebug: true,
    isPlayerEvent: true,
    execute: async (message) => {
        const executionId = uuidv4();

        const logger = require('../../services/logger').child({
            source: 'playerDebug.js',
            module: 'event',
            name: 'playerDebug',
            executionId: executionId
        });

        logger.trace(message);
    }
};
