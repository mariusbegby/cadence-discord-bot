const { v4: uuidv4 } = require('uuid');
const { Events } = require('discord.js');

module.exports = {
    name: Events.Warn,
    isDebug: false,
    once: false,
    execute: async (warning) => {
        const executionId = uuidv4();

        const logger = require('../../services/logger').child({
            source: 'warn.js',
            module: 'event',
            name: 'clientWarn',
            executionId: executionId
        });

        logger.warn(warning);
    }
};
