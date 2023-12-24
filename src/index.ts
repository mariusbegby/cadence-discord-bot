// .ENV file is loaded auomaically by doenv
import 'dotenv/config';
// Only after loading .ENV file, we can load other modules
import config from 'config';
import { Client, Shard, ShardEvents, ShardingManager, ShardingManagerOptions } from 'discord.js';
import { randomUUID as uuidv4 } from 'node:crypto';
import { exec } from 'child_process';
import { Logger } from 'pino';
import loggerModule from './services/logger';
import { getPrismaClient } from './services/prismaClient';
const shardingOptions: ShardingManagerOptions = config.get('shardingOptions');

const manager: ShardingManager = new ShardingManager('./dist/bot.js', {
    token: process.env.DISCORD_BOT_TOKEN,
    ...shardingOptions
});

const readyShards: Set<number> = new Set();

manager.on('shardCreate', (shard: Shard) => {
    const executionId: string = uuidv4();

    const logger: Logger = loggerModule.child({
        module: 'shardingManager',
        name: 'shardingManager',
        executionId: executionId,
        shardId: 'manager'
    });

    const prisma = getPrismaClient();

    process.on('SIGINT', async () => {
        await prisma.$disconnect();
        process.exit(0);
    });

    logger.info(`Launched shard with id ${shard.id}.`);

    // When all shards are ready, emit event 'allShardsReady' to all shards
    shard.on(ShardEvents.Ready, () => {
        readyShards.add(shard.id);
        if (readyShards.size === manager.totalShards) {
            manager.broadcastEval((client: Client) => client.emit('allShardsReady'));
            logger.info('All shards ready, bot is now online.');
        }
    });

    shard.on(ShardEvents.Death, (event) => {
        logger.fatal(event, 'SHARD CLOSED UNEXPECTEDLY.');
    });

    shard.on(ShardEvents.Error, (error) => {
        logger.error(error, 'Shard experienced an error, most likely related to websocket connection error.');
    });

    shard.on(ShardEvents.Disconnect, () => {
        logger.warn('Shard disconnected.');
    });

    shard.on(ShardEvents.Reconnecting, () => {
        logger.warn('Shard reconnecting.');
    });
});

exec('ffmpeg -version', (error) => {
    if (error) {
        const logger: Logger = loggerModule.child({
            module: 'shardingManager',
            name: 'shardingManager',
            shardId: 'manager'
        });

        logger.error('FFmpeg is not installed or available on your system.');
        logger.error('Install FFmpeg (https://ffmpeg.org/download.html) and try again.');
        logger.error('If you are using Windows, make sure to add FFmpeg to your PATH.');

        process.exit();
    }
});

manager.spawn();
