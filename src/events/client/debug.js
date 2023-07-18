const logger = require('../../services/logger');
const { Events } = require('discord.js');

module.exports = {
    name: Events.Debug,
    isDebug: true,
    once: false,
    execute: async (message) => {
        logger.debug(message);
    }
};
