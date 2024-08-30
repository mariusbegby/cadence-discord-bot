import config from 'config';
import { type IPRotationConfig, Player } from 'discord-player';
import { loggerService, type Logger } from '../services/logger';
import type { CreatePlayerParams } from '../../types/playerTypes';
import { YoutubeiExtractor, generateTrustedToken, generateTrustedTokenInterval } from 'discord-player-youtubei';

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
        });

        const tokens = await generateTrustedToken();
        await player.extractors.register(YoutubeiExtractor, {
            authentication: process.env.YT_EXTRACTOR_AUTH || '',
            streamOptions: {
                useClient: 'IOS',
                highWaterMark: 2 * 1_024 * 1_024 // 2MB, default is 512 KB (512 * 1_024)
            },
            disablePlayer: true,
            trustedTokens: tokens
        });

        const cronJob = generateTrustedTokenInterval({
            onGenerate: (tokens) => {
                const instance = YoutubeiExtractor.getInstance();
                instance?.setTrustedTokens(tokens);
            },
            onError: (err) => {
                logger.error(err, 'Failed to generate trusted tokens');
            }
        });

        (await cronJob).background();

        // make player accessible from anywhere in the application
        // primarily to be able to use it in broadcastEval and other sharding methods
        // @ts-ignore
        global.player = player;

        await player.extractors.loadDefault((ext) => !['YouTubeExtractor'].includes(ext));
        logger.trace(`discord-player loaded dependencies:\n${player.scanDeps()}`);

        return player;
    } catch (error) {
        logger.error(error, 'Failed to create discord-player player');
        throw error;
    }
};
