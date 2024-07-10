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
            ipconfig: ipRotationConfig,
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

        // TEMPORARY FIX
        // Need error handling
        await player.extractors.register(YoutubeiExtractor, {
            authentication: {
                access_token: process.env.YT_ACCESS_TOKEN || '',
                refresh_token: process.env.YT_REFRESH_TOKEN || '',
                scope: 'https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube-paid-content',
                token_type: 'Bearer',
                expiry_date: '2024-07-10T11:37:01.093Z'
            }
        });

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
