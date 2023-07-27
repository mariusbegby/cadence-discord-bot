const logger = require('../services/logger');
const fs = require('node:fs');
const path = require('node:path');
const { Collection } = require('discord.js');

exports.registerClientCommands = (client) => {
    logger.debug(`[Shard ${client.shard.ids[0]}] Registering client commands...`);
    client.commands = new Collection();

    const commandFolders = fs.readdirSync(path.resolve('./src/commands'));
    for (const folder of commandFolders) {
        const commandFiles = fs
            .readdirSync(path.resolve(`./src/commands/${folder}`))
            .filter((file) => file.endsWith('.js'));

        for (const file of commandFiles) {
            try {
                logger.trace(`[Shard ${client.shard.ids[0]}] Registering command ${folder}/${file}...`);

                // delete command from require cache
                delete require.cache[require.resolve(`../commands/${folder}/${file}`)];

                // register command
                const command = require(`../commands/${folder}/${file}`);
                client.commands.delete(command.data.name);
                client.commands.set(command.data.name, command);
            } catch (error) {
                logger.error(
                    `[Shard ${client.shard.ids[0]}] Error registering command ${folder}/${file}: ${error.message}`
                );
            }
        }
    }
};
