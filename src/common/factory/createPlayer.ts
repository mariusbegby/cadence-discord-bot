/* eslint-disable camelcase */
import config from 'config';
import { IPRotationConfig, Player } from 'discord-player';
import { SpotifyExtractor } from '@discord-player/extractor';
import { loggerService, Logger } from '../services/logger';
import { CreatePlayerParams } from '../../types/playerTypes';
import { YoutubeiExtractor, createYoutubeiStream } from 'discord-player-youtubei';

export const createPlayer = async ({ client, executionId }: CreatePlayerParams): Promise<Player> => {
    const logger: Logger = loggerService.child({
        module: 'utilFactory',
        name: 'createPlayer',
        executionId: executionId,
        shardId: client.shard?.ids[0]
    });

    const ipRotationConfig = config.get<IPRotationConfig>('ipRotationConfig');

    try {
        logger.debug('Creating discord-player player...');

        const player: Player = new Player(client, {
            useLegacyFFmpeg: false,
            skipFFmpeg: false,
            ipconfig: ipRotationConfig
            /* new youtube extractor is not ytdl based, so this is not needed
            ytdlOptions: {
                quality: 'highestaudio',
                highWaterMark: 1 << 25,
                requestOptions: {
                    headers: {
                        cookie: process.env.YT_COOKIE || ''
                    }
                }
            }
            */
        });

        // Testing out new youtube extractor
        await player.extractors.register(YoutubeiExtractor, {
            authentication: process.env.YT_EXTRACTOR_AUTH || ''
        });

        // Using new youtube extractor as bridge for spotify
        await player.extractors.register(SpotifyExtractor, {
            createStream: createYoutubeiStream
        });

        // make player accessible from anywhere in the application
        // primarily to be able to use it in broadcastEval and other sharding methods
        // @ts-ignore
        global.player = player;

        await player.extractors.loadDefault();
        await player.extractors.loadDefault((ext) => !['YouTubeExtractor', 'SpotifyExtractor'].includes(ext));
        logger.trace(`discord-player loaded dependencies:\n${player.scanDeps()}`);

        return player;
    } catch (error) {
        logger.error(error, 'Failed to create discord-player player');
        throw error;
    }
};
