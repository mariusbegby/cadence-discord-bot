// .ENV file is loaded automatically by dotenv
import 'dotenv/config';

// Only after loading .ENV file, we can load other modules
import { Player } from 'discord-player';
import { Client } from 'discord.js';
import { randomUUID as uuidv4 } from 'node:crypto';
import { Logger } from 'pino';
import loggerModule from './services/logger';
import { ExtendedClient } from './types/clientTypes';
import { createClient } from './utils/factory/createClient';
import { createPlayer } from './utils/factory/createPlayer';
import { registerClientInteractions } from './utils/registerClientInteractions';
import { registerEventListeners } from './utils/registerEventListeners';

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

        let allShardsReadyReceived: boolean = false;

        client.on('allShardsReady', async () => {
            if (allShardsReadyReceived) {
                logger.debug('allShardsReady event received, but already received before. Ignoring.');
                return;
            }

            logger.debug('allShardsReady event received, registering client interactions and event listeners.');
            client.registerClientInteractions = registerClientInteractions;
            await registerEventListeners({ client, player, executionId });
            await registerClientInteractions({ client, executionId });
            client.emit('ready', client as Client);
            allShardsReadyReceived = true;
        });

        client.login(process.env.DISCORD_BOT_TOKEN);
    } catch (error) {
        logger.error(error);
    }
})();
