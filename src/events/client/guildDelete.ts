import { Events, Guild } from 'discord.js';
import { v4 as uuidv4 } from 'uuid';

import loggerModule from '../../services/logger';
import { Logger } from 'pino';

module.exports = {
    name: Events.GuildDelete,
    isDebug: false,
    once: false,
    execute: async (guild: Guild) => {
        const executionId: string = uuidv4();
        const logger: Logger = loggerModule.child({
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
