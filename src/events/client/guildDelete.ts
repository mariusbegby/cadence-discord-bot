import { Events, Guild } from 'discord.js';
import { randomUUID as uuidv4 } from 'node:crypto';
import { Logger } from 'pino';
import loggerModule from '../../services/logger';

module.exports = {
    name: Events.GuildDelete,
    isDebug: false,
    once: false,
    execute: async (guild: Guild) => {
        const executionId: string = uuidv4();
        const logger: Logger = loggerModule.child({
            module: 'event',
            name: 'guildDelete',
            executionId: executionId,
            shardId: guild.shardId,
            guildId: guild.id
        });

        logger.info(`Removed from guild '${guild.id}' with ${guild.memberCount} members.`);
    }
};
