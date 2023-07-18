const logger = require('../../services/logger');
const { Events } = require('discord.js');

module.exports = {
    name: Events.Warn,
    isDebug: false,
    once: false,
    execute: async (warning) => {
        logger.warn(warning);
    }
};
