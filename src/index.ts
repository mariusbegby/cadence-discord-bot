import 'dotenv/config';

import config from 'config';
import { Client, Shard, ShardEvents, ShardingManager } from 'discord.js';
import { v4 as uuidv4 } from 'uuid';

import loggerModule from './services/logger';
import { ShardingOptions } from './types/configTypes';

const shardingOptions: ShardingOptions = config.get('shardingOptions');

const manager = new ShardingManager('./dist/bot.js', {
    token: process.env.DISCORD_BOT_TOKEN,
    ...shardingOptions
});

const readyShards = new Set();

manager.on('shardCreate', (shard: Shard) => {
    const executionId = uuidv4();

    const logger = loggerModule.child({
        source: 'index.js',
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
});

manager.spawn();
