// .ENV file is loaded automatically by dotenv
import 'dotenv/config';

// Only after loading .ENV file, we can load other modules
import config from 'config';
import { Client, Shard, ShardEvents, ShardingManager, ShardingManagerOptions } from 'discord.js';
import { randomUUID as uuidv4 } from 'node:crypto';
import { Logger } from 'pino';
import loggerModule from './services/logger';
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

manager.spawn();
