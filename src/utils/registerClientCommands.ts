import { Collection } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';

import loggerModule from '../services/logger';
import { RegisterClientCommandsParams } from '../types/utilTypes';
import { Logger } from 'pino';

export const registerClientCommands = async ({ client, executionId }: RegisterClientCommandsParams) => {
    const logger: Logger = loggerModule.child({
        source: 'registerClientCommands.js',
        module: 'register',
        name: 'registerClientCommands',
        executionId: executionId,
        shardId: client.shard?.ids[0]
    });

    logger.debug('Registering client commands...');
    client.commands = new Collection();

    /*
    const commandFolders: string[] = fs.readdirSync(path.resolve('./dist/interactions/commands'));
    for (const folder of commandFolders) {
        logger.trace(`Registering client commands for folder '${folder}'...`);
        
        const commandFiles: string[] = fs
            .readdirSync(path.resolve(`./dist/interactions/commands/${folder}`))
            .filter((file) => file.endsWith('.js'));
        
        for (const file of commandFiles) {
            try {
                // delete command from require cache
                delete require.cache[require.resolve(`../interactions/commands/${folder}/${file}`)];

                // register command
                //const command = require(`../interactions/commands/${folder}/${file}`);
                const commandModule = await import(`../interactions/commands/${folder}/${file}`);

                client.commands.delete(commandModule.default.data.name);
                client.commands.set(commandModule.default.data.name, commandModule.default);
            } catch (error) {
                if (error instanceof Error) {
                    logger.error(`Error registering command ${folder}/${file}: ${error.message}`);
                } else {
                    throw error;
                }
            }
        }

    }
    */

    const commandModule = await import('../interactions/commands/player/test.js');
    const command = commandModule.default;

    logger.info(command.data);
    client.commands.set('test', command);

    logger.trace('Registering client commands complete.');
};
