const { v4: uuidv4 } = require('uuid');
const { Events } = require('discord.js');

module.exports = {
    name: Events.Error,
    isDebug: false,
    once: false,
    execute: async (error) => {
        const executionId = uuidv4();

        const logger = require('../../services/logger').child({
            source: 'error.js',
            module: 'event',
            name: 'clientError',
            executionId: executionId
        });

        logger.error(error);
    }
};
