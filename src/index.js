require('dotenv').config();
const { shardingOptions } = require('./config');
const logger = require('./services/logger');
const { ShardingManager, ShardEvents } = require('discord.js');

const manager = new ShardingManager('./src/bot.js', {
    token: process.env.DISCORD_BOT_TOKEN,
    ...shardingOptions
});

const readyShards = new Set();
manager.on('shardCreate', (shard) => {
    logger.debug(`[Shard ${shard.id}] Launched shard with id ${shard.id}.`);

    // When all shards are ready, emit event 'allShardsReady' to all shards
    shard.on(ShardEvents.Ready, () => {
        readyShards.add(shard.id);
        if (readyShards.size === manager.totalShards) {
            manager.broadcastEval((client) => client.emit('allShardsReady'));
        }
    });
});

manager.spawn();
