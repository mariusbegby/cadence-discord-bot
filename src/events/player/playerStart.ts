import { v4 as uuidv4 } from 'uuid';
import loggerModule from '../../services/logger';

module.exports = {
    name: 'playerStart',
    isDebug: false,
    isPlayerEvent: true,
    execute: async (queue, track) => {
        const executionId = uuidv4();
        const logger = loggerModule.child({
            source: 'playerStart.js',
            module: 'event',
            name: 'playerStart',
            executionId: executionId,
            shardId: queue.metadata.client.shard.ids[0],
            guildId: queue.metadata.channel.guild.id
        });

        logger.debug(`playerStart event: Started playing '${track.url}'.`);
    }
};
