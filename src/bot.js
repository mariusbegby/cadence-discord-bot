require('dotenv').config();
const logger = require('./services/logger');
const { registerEventListeners } = require('./utils/registerEventListeners.js');
const { registerClientCommands } = require('./utils/registerClientCommands.js');
const { createClient } = require('./utils/factory/createClient.js');
const { createPlayer } = require('./utils/factory/createPlayer.js');

(async () => {
    const client = await createClient();
    const player = await createPlayer(client);

    client.on('allShardsReady', async () => {
        client.registerClientCommands = registerClientCommands;
        registerEventListeners(client, player);
        registerClientCommands(client);
        client.emit('ready', client);
    });

    client.login(process.env.DISCORD_BOT_TOKEN);
})().catch((error) => {
    logger.error(error);
});
