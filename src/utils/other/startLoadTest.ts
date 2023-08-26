import config from 'config';
const loadTestOptions = config.get('loadTestOptions');

exports.startLoadTest = async ({ client, executionId }) => {
    const logger = require('../../services/logger').child({
        source: 'startLoadTest.js',
        module: 'utilOther',
        name: 'startLoadTest',
        executionId: executionId,
        shardId: client.shard.ids[0]
    });

    if (!loadTestOptions.enabled) {
        logger.debug('Load test is disabled in options, cancelling.');
        return;
    }

    const channelIds = loadTestOptions.channelIdsToJoin;
    const track = loadTestOptions.trackUrl;

    logger.info(`Starting load test in ${channelIds.length} specified channels.`);

    channelIds.forEach((each) => {
        client.shard.broadcastEval(
            async (shardClient, { channelId, track }) => {
                const channel = shardClient.channels.cache.get(channelId);
                if (channel) {
                    /* eslint-disable no-undef */
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
