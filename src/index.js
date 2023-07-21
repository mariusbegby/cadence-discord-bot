require('dotenv').config();
const logger = require('./services/logger');
const { ShardingManager, ShardEvents } = require('discord.js');

const manager = new ShardingManager('./src/bot.js', {
    token: process.env.DISCORD_BOT_TOKEN,
    totalShards: 2,
    shardList: 'auto',
    mode: 'process',
    respawn: true
});

const readyShards = new Set();
manager.on('shardCreate', (shard) => {
    logger.debug(`Launched shard ${shard.id}`);

    // When all shards are ready, emit event 'allShardsReady' to all shards
    shard.on(ShardEvents.Ready, () => {
        readyShards.add(shard.id);
        if (readyShards.size === manager.totalShards) {
            manager.broadcastEval((client) => client.emit('allShardsReady'));
        }
    });
});

manager.spawn();
