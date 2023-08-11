const logger = require('../../services/logger');
const { Player, onBeforeCreateStream } = require('discord-player');

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

        /* Seems to not be needed with @distube/ytdl-core, long duration videos work fine, keeping commented for now
        onBeforeCreateStream(async (track) => {
            if (track.source === 'youtube') {
                return (
                    await stream(track.url, {
                        type: 'audio',
                        quality: 'high',
                        highWaterMark: 1 << 25,
                        cookie: process.env.YT_COOKIE || ''
                    })
                ).stream;
            }

            return null;
        });
        */

        await player.extractors.loadDefault();
        logger.trace(`[Shard ${client.shard.ids[0]}] discord-player loaded dependencies:\n${player.scanDeps()}`);

        return player;
    } catch (error) {
        logger.error(`[Shard ${client.shard.ids[0]}] Failed to create discord-player player`, error);
        throw error;
    }
};
