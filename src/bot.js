require('dotenv').config();
const { registerEventListeners } = require('./utils/registerEventListeners.js');
const { registerClientCommands } = require('./utils/registerClientCommands.js');
const { createClient } = require('./utils/factory/createClient.js');
const { createPlayer } = require('./utils/factory/createPlayer.js');
const { v4: uuidv4 } = require('uuid');

const executionId = uuidv4();

const logger = require('./services/logger').child({
    source: 'bot.js',
    module: 'shardingClient',
    name: 'shardingClient',
    executionId: executionId,
    shardId: 'client'
});

(async () => {
    const client = await createClient({ executionId });
    const player = await createPlayer({ client, executionId });

    client.on('allShardsReady', async () => {
        client.registerClientCommands = registerClientCommands;
        registerEventListeners({ client, player, executionId });
        registerClientCommands({ client, executionId });
        client.emit('ready', client);
    });

    client.login(process.env.DISCORD_BOT_TOKEN);
})().catch((error) => {
    logger.error(error);
});
