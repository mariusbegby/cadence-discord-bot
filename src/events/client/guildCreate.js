const logger = require('../../services/logger');
const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildCreate,
    isDebug: false,
    once: false,
    execute: async (guild) => {
        logger.info(`Added to guild '${guild.name}' with ${guild.memberCount} members.`);
    }
};
