require('dotenv').config();
const logger = require('./services/logger');
const { ShardingManager } = require('discord.js');

const manager = new ShardingManager('./src/bot.js', {
    token: process.env.DISCORD_BOT_TOKEN,
    totalShards: 'auto',
    shardList: 'auto',
    mode: 'process',
    respawn: true
});

manager.on('shardCreate', (shard) => {
    logger.debug(`Launched shard ${shard.id}`);
});

manager.spawn();
