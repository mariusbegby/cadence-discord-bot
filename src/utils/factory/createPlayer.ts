import config from 'config';
import { IPRotationConfig, Player } from 'discord-player';
import { Logger } from 'pino';
import loggerModule from '../../services/logger';
import { CreatePlayerParams } from '../../types/playerTypes';

export const createPlayer = async ({ client, executionId }: CreatePlayerParams): Promise<Player> => {
    const logger: Logger = loggerModule.child({
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

        // make player accessible from anywhere in the application
        // primarily to be able to use it in broadcastEval and other sharding methods
        // @ts-ignore
        global.player = player;

        await player.extractors.loadDefault();
        logger.trace(`discord-player loaded dependencies:\n${player.scanDeps()}`);

        return player;
    } catch (error) {
        logger.error(error, 'Failed to create discord-player player');
        throw error;
    }
};
