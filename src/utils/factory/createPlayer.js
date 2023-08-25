const logger = require('../../services/logger');
const { Player } = require('discord-player');

exports.createPlayer = async (client) => {
    try {
        logger.info(`[Shard ${client.shard.ids[0]}] Creating discord-player player...`);

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
        logger.trace(`[Shard ${client.shard.ids[0]}] discord-player loaded dependencies:\n${player.scanDeps()}`);

        return player;
    } catch (error) {
        logger.error(`[Shard ${client.shard.ids[0]}] Failed to create discord-player player`, error);
        throw error;
    }
};
