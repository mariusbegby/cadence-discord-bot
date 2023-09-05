import config from 'config';
import { Channel, Client } from 'discord.js';
import { Logger } from 'pino';
import loggerModule from '../../services/logger';
import { LoadTestOptions } from '../../types/configTypes';
import { StartLoadTestParams } from '../../types/utilTypes';

const loadTestOptions: LoadTestOptions = config.get('loadTestOptions');

export const startLoadTest = async ({ client, executionId }: StartLoadTestParams) => {
    const logger: Logger = loggerModule.child({
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

    channelIds.forEach((each) => {
        client.shard?.broadcastEval(
            async (shardClient: Client, { channelId, track }: { channelId: string; track: string }) => {
                const channel: Channel | undefined = shardClient.channels.cache.get(channelId);
                if (channel) {
                    /* eslint-disable no-undef */
                    // @ts-ignore
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
    });

    logger.info('Load test started across shards in specified channels.');
};
