const { Events } = require('discord.js');
const { v4: uuidv4 } = require('uuid');

module.exports = {
    name: Events.GuildCreate,
    isDebug: false,
    once: false,
    execute: async (guild) => {
        const executionId = uuidv4();

        const logger = require('../../services/logger').child({
            source: 'guildCreate.js',
            module: 'event',
            name: 'guildCreate',
            executionId: executionId,
            shardId: guild.shardId,
            guildId: guild.id
        });

        logger.info(`Added to guild '${guild.id}' with ${guild.memberCount} members.`);
    }
};
