import 'dotenv/config';

import { Client } from 'discord.js';
import { v4 as uuidv4 } from 'uuid';

import loggerModule from './services/logger';
import { ExtendedClient } from './types/clientTypes';
import { createClient } from './utils/factory/createClient';
import { createPlayer } from './utils/factory/createPlayer';
import { registerClientCommands } from './utils/registerClientCommands';
import { registerEventListeners } from './utils/registerEventListeners';

const executionId = uuidv4();
const logger = loggerModule.child({
    source: 'bot.js',
    module: 'shardingClient',
    name: 'shardingClient',
    executionId: executionId,
    shardId: 'client'
});

(async () => {
    try {
        const client: ExtendedClient = await createClient({ executionId });
        const player = await createPlayer({ client, executionId });
    
        client.on('allShardsReady', async () => {
            client.registerClientCommands = registerClientCommands;
            await registerEventListeners({ client, player, executionId });
            await registerClientCommands({ client, executionId });
            client.emit('ready', client as Client);
        });
    
        client.login(process.env.DISCORD_BOT_TOKEN);
    } catch (error) {
        logger.error(error);
    }
})();
