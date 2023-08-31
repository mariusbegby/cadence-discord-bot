import { Track } from 'discord-player';
import { Logger } from 'pino';
import { v4 as uuidv4 } from 'uuid';
import loggerModule from '../../services/logger';
import { ExtendedGuildQueuePlayerNode } from '../../types/eventTypes';

module.exports = {
    name: 'playerStart',
    isDebug: false,
    isPlayerEvent: true,
    execute: async (queue: ExtendedGuildQueuePlayerNode, track: Track) => {
        const executionId: string = uuidv4();
        const logger: Logger = loggerModule.child({
            module: 'event',
            name: 'playerStart',
            executionId: executionId,
            shardId: queue.metadata?.client.shard?.ids[0],
            guildId: queue.metadata?.channel.guild.id
        });

        logger.debug(`playerStart event: Started playing '${track.url}'.`);
    }
};
