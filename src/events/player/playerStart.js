const logger = require('../../services/logger');

module.exports = {
    name: 'playerStart',
    isDebug: false,
    isPlayerEvent: true,
    execute: async (queue, track) => {
        logger.debug(
            `[Shard ${queue.metadata.client.shard.ids[0]}] playerStart event: Started playing '${track.raw.url}'.`
        );
        process.env.NODE_ENV === 'development' ? logger.trace(queue) : null;
    }
};
