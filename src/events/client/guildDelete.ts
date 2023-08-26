const { Events } = require('discord.js');
const { v4: uuidv4 } = require('uuid');

module.exports = {
    name: Events.GuildDelete,
    isDebug: false,
    once: false,
    execute: async (guild) => {
        const executionId = uuidv4();

        const logger = require('../../services/logger').child({
            source: 'guildDelete.js',
            module: 'event',
            name: 'guildDelete',
            executionId: executionId,
            shardId: guild.shardId,
            guildId: guild.id
        });

        logger.info(`Removed from guild '${guild.id}' with ${guild.memberCount} members.`);
    }
};
