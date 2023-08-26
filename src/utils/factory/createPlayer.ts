const { Player } = require('discord-player');

exports.createPlayer = async ({ client, executionId }) => {
    const logger = require('../../services/logger').child({
        source: 'createPlayer.js',
        module: 'utilFactory',
        name: 'createPlayer',
        executionId: executionId,
        shardId: client.shard.ids[0]
    });

    try {
        logger.debug('Creating discord-player player...');

        const player = new Player(client, {
            useLegacyFFmpeg: false,
            ytdlOptions: {
                quality: 'highestaudio',
                highWaterMark: 1 << 25,
                requestOptions: {
                    headers: {
                        cookie: process.env.YT_COOKIE || ''
                    }
                }
            }
        });

        // make player accessible from anywhere in the application
        // primarily to be able to use it in broadcastEval and other sharding methods
        global.player = player;

        await player.extractors.loadDefault();
        logger.trace(`discord-player loaded dependencies:\n${player.scanDeps()}`);

        return player;
    } catch (error) {
        logger.error(error, 'Failed to create discord-player player');
        throw error;
    }
};
