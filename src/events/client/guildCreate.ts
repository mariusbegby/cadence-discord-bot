import { Events, Guild } from 'discord.js';
import { randomUUID as uuidv4 } from 'node:crypto';
import { Logger } from 'pino';
import loggerModule from '../../services/logger';

module.exports = {
    name: Events.GuildCreate,
    isDebug: false,
    once: false,
    execute: async (guild: Guild) => {
        const executionId: string = uuidv4();
        const logger: Logger = loggerModule.child({
            module: 'event',
            name: 'guildCreate',
            executionId: executionId,
            shardId: guild.shardId,
            guildId: guild.id
        });

        logger.info(`Added to guild '${guild.id}' with ${guild.memberCount} members.`);
    }
};
