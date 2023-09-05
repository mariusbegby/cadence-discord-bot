import config from 'config';
import { GuildQueueEvents, Player, PlayerEvents } from 'discord-player';
import { Client } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { Logger } from 'pino';
import loggerModule from '../services/logger';
import { CustomLoggerOptions } from '../types/configTypes';
import { ClientEventArguments, PlayerEventArguments, ProcessEventArguments } from '../types/eventTypes';
import { CustomEvent, RegisterEventListenersParams } from '../types/utilTypes';

const loggerOptions: CustomLoggerOptions = config.get('loggerOptions');

const registerClientEventListeners = (client: Client, event: CustomEvent) => {
    if (event.once) {
        client.once(event.name, (...args: ClientEventArguments) => event.execute(...args));
    } else {
        if (!event.isDebug || process.env.MINIMUM_LOG_LEVEL === 'debug') {
            client.on(event.name, (...args: ClientEventArguments) => event.execute(...args));
        }
    }
};

const registerInteractionEventListeners = (client: Client, event: CustomEvent) => {
    client.on(event.name, (...args: ClientEventArguments) => event.execute(...args, { client }));
};

const registerProcessEventListeners = (event: CustomEvent) => {
    process.on(event.name, (...args: ProcessEventArguments) => event.execute(...args));
};

const registerPlayerEventListeners = (player: Player, event: CustomEvent, loggerOptions: CustomLoggerOptions) => {
    if (!event.isDebug || (loggerOptions.minimumLogLevel === 'debug' && loggerOptions.discordPlayerDebug)) {
        if (event.isPlayerEvent) {
            player.events.on(event.name as keyof GuildQueueEvents, (...args: PlayerEventArguments) =>
                event.execute(...args)
            );
        } else {
            player.on(event.name as keyof PlayerEvents, (...args: PlayerEventArguments) => event.execute(...args));
        }
    }
};

export const registerEventListeners = async ({ client, player, executionId }: RegisterEventListenersParams) => {
    const logger: Logger = loggerModule.child({
        module: 'register',
        name: 'registerEventListeners',
        executionId: executionId,
        shardId: client.shard?.ids[0]
    });

    logger.debug('Registering event listeners...');

    const eventFolders: string[] = fs.readdirSync(path.resolve('./dist/events'));
    for (const folder of eventFolders) {
        logger.trace(`Registering event listener for folder '${folder}'...`);

        const eventFiles: string[] = fs
            .readdirSync(path.resolve(`./dist/events/${folder}`))
            .filter((file) => file.endsWith('.js'));

        for (const file of eventFiles) {
            const event = await import(`../events/${folder}/${file}`);
            switch (folder) {
                case 'client':
                    registerClientEventListeners(client, event);
                    break;

                case 'interactions':
                    registerInteractionEventListeners(client, event);
                    break;

                case 'process':
                    registerProcessEventListeners(event);
                    break;

                case 'player':
                    registerPlayerEventListeners(player, event, loggerOptions);
                    break;

                default:
                    logger.error(`Unknown event folder '${folder}' while trying to register events.`);
            }
        }
    }

    logger.trace('Registering event listeners complete.');
};
