const logger = require('../../services/logger');
const config = require('config');
const loadTestOptions = config.get('loadTestOptions');

exports.startLoadTest = async (client) => {
    if (!loadTestOptions.enabled) {
        return;
    }

    const channelIds = loadTestOptions.channelIdsToJoin;
    const track = loadTestOptions.trackUrl;
    logger.info(`Starting load test in ${channelIds.length} channels.`);

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
};
