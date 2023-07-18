const logger = require('../../services/logger');
const { Events } = require('discord.js');

module.exports = {
    name: Events.Error,
    isDebug: false,
    once: false,
    execute: async (error) => {
        logger.error(error);
    }
};
