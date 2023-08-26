require('dotenv').config();
const shardingOptions = require('config').get('shardingOptions');
const { ShardingManager, ShardEvents } = require('discord.js');
const { v4: uuidv4 } = require('uuid');

const manager = new ShardingManager('./dist/bot.js', {
    token: process.env.DISCORD_BOT_TOKEN,
    ...shardingOptions
});

const readyShards = new Set();

manager.on('shardCreate', (shard) => {
    const executionId = uuidv4();

    const logger = require('./services/logger').child({
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
            manager.broadcastEval((client) => client.emit('allShardsReady'));
            logger.info('All shards ready, bot is now online.');
        }
    });
});

manager.spawn();
