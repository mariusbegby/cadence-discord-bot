const logger = require('../../services/logger');
const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildDelete,
    isDebug: false,
    once: false,
    execute: async (guild) => {
        logger.info(`Removed from guild '${guild.name}' with ${guild.memberCount} members.`);
    }
};
