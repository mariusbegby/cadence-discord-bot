import { Track } from 'discord-player';
import { randomUUID as uuidv4 } from 'node:crypto';
import { Logger } from 'pino';
import loggerModule from '../../services/logger';
import { ExtendedGuildQueuePlayerNode } from '../../types/eventTypes';

// Emitted when the audio player finish playing a track.
module.exports = {
    name: 'playerFinish',
    isDebug: false,
    isPlayerEvent: true,
    execute: async (queue: ExtendedGuildQueuePlayerNode, track: Track) => {
        const executionId: string = uuidv4();
        const logger: Logger = loggerModule.child({
            module: 'event',
            name: 'playerFinish',
            executionId: executionId,
            shardId: queue.metadata?.client.shard?.ids[0],
            guildId: queue.metadata?.channel.guild.id
        });

        logger.debug(
            `playerFinish event: Track [${track.url}] finished playing, deleting previous now-playing message.`
        );

        const { lastMessage } = queue.metadata || {};
        const fetchedLastPlayingMessage =
            (await queue.metadata?.channel.messages.fetch(lastMessage?.id as string)) || undefined;

        if (fetchedLastPlayingMessage && fetchedLastPlayingMessage.deletable) {
            try {
                await fetchedLastPlayingMessage.delete();
            } catch (error) {
                logger.error(error, `playerFinish event: Error deleting previous now-playing message.`);
            }
        }

        logger.debug(`playerFinish event: Previous now-playing message deleted.`);
    }
};