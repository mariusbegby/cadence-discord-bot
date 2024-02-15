import { Track } from 'discord-player';
import { randomUUID as uuidv4 } from 'node:crypto';
import { loggerService, Logger } from '../../common/services/logger';
import { ExtendedGuildQueuePlayerNode } from '../../types/eventTypes';
import { User } from 'discord.js';

// Emitted when the audio player will add a new track to the queue from autoplay.
module.exports = {
    name: 'willAutoPlay',
    isDebug: false,
    isPlayerEvent: true,
    execute: async (queue: ExtendedGuildQueuePlayerNode, tracks: Track[], done: (track: Track) => void) => {
        const executionId: string = uuidv4();
        const logger: Logger = loggerService.child({
            module: 'event',
            name: 'willAutoPlay',
            executionId: executionId,
            shardId: queue.metadata?.client.shard?.ids[0],
            guildId: queue.metadata?.channel.guild.id
        });

        const [track] = tracks;

        track.requestedBy = queue.metadata?.client.user as User;

        done(track);

        logger.debug(`Autoplay track [${track.url}] changed requestedBy to bot`);
    }
};
