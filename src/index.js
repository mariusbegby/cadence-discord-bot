require('dotenv').config();
const logger = require('./services/logger');
const { registerEventListeners } = require('./utils/registerEventListeners.js');
const { registerClientCommands } = require('./utils/registerClientCommands.js');
const { createClient } = require('./utils/createClient.js');
const { createPlayer } = require('./utils/createPlayer.js');

(async () => {
    const client = await createClient();
    const player = await createPlayer(client);

    registerEventListeners(client, player);
    registerClientCommands(client);

    client.login(process.env.DISCORD_BOT_TOKEN);
})().catch((error) => {
    logger.error(error);
});
