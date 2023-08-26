import fs from 'node:fs';
import path from 'node:path';
import { Collection } from 'discord.js';
import loggerModule from '../services/logger';

export const registerClientCommands = ({ client, executionId }) => {
    const logger = loggerModule.child({
        source: 'registerClientCommands.js',
        module: 'register',
        name: 'registerClientCommands',
        executionId: executionId,
        shardId: client.shard.ids[0]
    });

    logger.debug('Registering client commands...');
    client.commands = new Collection();

    const commandFolders = fs.readdirSync(path.resolve('./dist/commands'));
    for (const folder of commandFolders) {
        logger.trace(`Registering client commands for folder '${folder}'...`);
        const commandFiles = fs
            .readdirSync(path.resolve(`./dist/commands/${folder}`))
            .filter((file) => file.endsWith('.js'));

        for (const file of commandFiles) {
            try {
                // delete command from require cache
                delete require.cache[require.resolve(`../commands/${folder}/${file}`)];

                // register command
                /* eslint-disable @typescript-eslint/no-var-requires */
                const command = require(`../commands/${folder}/${file}`);
                client.commands.delete(command.data.name);
                client.commands.set(command.data.name, command);
            } catch (error) {
                logger.error(`Error registering command ${folder}/${file}: ${error.message}`);
            }
        }
    }

    logger.trace('Registering client commands complete.');
};
