const { v4: uuidv4 } = require('uuid');
const { Events } = require('discord.js');

module.exports = {
    name: Events.Debug,
    isDebug: true,
    once: false,
    execute: async (message) => {
        const executionId = uuidv4();

        const logger = require('../../services/logger').child({
            source: 'debug.js',
            module: 'event',
            name: 'clientDebug',
            executionId: executionId
        });

        logger.debug(message);
    }
};
