const path = require('node:path');
const logger = require(path.resolve('./src/services/logger.js'));
const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildCreate,
    isDebug: false,
    once: false,
    execute: async (guild) => {
        logger.info(`Added to guild '${guild.name}' with ${guild.memberCount} members.`);
    }
};
