const path = require('node:path');
const logger = require(path.resolve('./src/services/logger.js'));
const { Events } = require('discord.js');

module.exports = {
    name: Events.Debug,
    isDebug: true,
    once: false,
    execute: async (message) => {
        logger.debug(message);
    }
};
