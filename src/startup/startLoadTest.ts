import config from 'config';
import type { Channel, Client } from 'discord.js';
import { loggerService, type Logger } from '../common/services/logger';
import type { LoadTestOptions } from '../types/configTypes';
import type { StartLoadTestParams } from '../types/utilTypes';

const loadTestOptions: LoadTestOptions = config.get('loadTestOptions');

export const startLoadTest = async ({ client, executionId }: StartLoadTestParams) => {
    const logger: Logger = loggerService.child({
        module: 'utilOther',
        name: 'startLoadTest',
        executionId: executionId,
        shardId: client.shard?.ids[0]
    });

    if (!loadTestOptions.enabled) {
        logger.debug('Load test is disabled in options, cancelling.');
        return;
    }

    const channelIds: string[] = loadTestOptions.channelIdsToJoin;
    const track: string = loadTestOptions.trackUrl;

    logger.info(`Starting load test in ${channelIds.length} specified channels.`);

    for (const each of channelIds) {
        await client.shard?.broadcastEval(
            async (shardClient: Client, { channelId, track }: { channelId: string; track: string }) => {
                const channel: Channel | undefined = shardClient.channels.cache.get(channelId);
                if (channel) {
                    await player.play(channel.id, track, {
                        nodeOptions: {
                            leaveOnEmpty: false,
                            leaveOnEnd: false,
                            leaveOnStop: false,
                            metadata: {
                                channel: channel,
                                client: shardClient
                            }
                        }
                    });
                }
            },
            { context: { channelId: each, track: track } }
        );
    }

    logger.info('Load test started across shards in specified channels.');
};
