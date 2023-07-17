const path = require('node:path');
const logger = require(path.resolve('./src/services/logger.js'));
const { Events } = require('discord.js');

module.exports = {
    name: Events.Warn,
    isDebug: false,
    once: false,
    execute: async (warning) => {
        logger.warn(warning);
    }
};
