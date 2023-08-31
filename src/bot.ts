import 'dotenv/config';

import { Client } from 'discord.js';
import { v4 as uuidv4 } from 'uuid';

import loggerModule from './services/logger';
import { ExtendedClient } from './types/clientTypes';
import { createClient } from './utils/factory/createClient';
import { createPlayer } from './utils/factory/createPlayer';
import { registerClientInteractions } from './utils/registerClientInteractions';
import { registerEventListeners } from './utils/registerEventListeners';
import { Player } from 'discord-player';
import { Logger } from 'pino';

const executionId: string = uuidv4();
const logger: Logger = loggerModule.child({
    module: 'shardingClient',
    name: 'shardingClient',
    executionId: executionId,
    shardId: 'client'
});

(async () => {
    try {
        const client: ExtendedClient = await createClient({ executionId });
        const player: Player = await createPlayer({ client, executionId });

        client.on('allShardsReady', async () => {
            client.registerClientInteractions = registerClientInteractions;
            await registerEventListeners({ client, player, executionId });
            await registerClientInteractions({ client, executionId });
            client.emit('ready', client as Client);
        });

        client.login(process.env.DISCORD_BOT_TOKEN);
    } catch (error) {
        logger.error(error);
    }
})();
