const path = require('node:path');
const logger = require(path.resolve('./src/services/logger.js'));
const { Events } = require('discord.js');

module.exports = {
    name: Events.Error,
    isDebug: false,
    once: false,
    execute: async (error) => {
        logger.error(error);
    }
};
