const path = require('node:path');
const logger = require(path.resolve('./src/services/logger.js'));
const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildDelete,
    isDebug: false,
    once: false,
    execute: async (guild) => {
        logger.info(`Removed from guild '${guild.name}' with ${guild.memberCount} members.`);
    }
};
