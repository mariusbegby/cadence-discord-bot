import { Events } from 'discord.js';
import { v4 as uuidv4 } from 'uuid';
import loggerModule from '../../services/logger';

module.exports = {
    name: Events.GuildCreate,
    isDebug: false,
    once: false,
    execute: async (guild) => {
        const executionId = uuidv4();
        const logger = loggerModule.child({
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
