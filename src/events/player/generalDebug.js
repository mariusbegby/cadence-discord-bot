const { v4: uuidv4 } = require('uuid');

module.exports = {
    name: 'debug',
    isDebug: true,
    isPlayerEvent: false,
    execute: async (message) => {
        const executionId = uuidv4();

        const logger = require('../../services/logger').child({
            source: 'generalDebug.js',
            module: 'event',
            name: 'playerGeneralDebug',
            executionId: executionId
        });

        logger.debug(message);
    }
};
