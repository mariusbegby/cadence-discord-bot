const logger = require('../services/logger');
const fs = require('node:fs');
const path = require('node:path');
const { Collection } = require('discord.js');

exports.registerClientCommands = (client) => {
    logger.debug('Registering client commands...');
    client.commands = new Collection();

    const commandFolders = fs.readdirSync(path.resolve('./src/commands'));
    for (const folder of commandFolders) {
        const commandFiles = fs
            .readdirSync(path.resolve(`./src/commands/${folder}`))
            .filter((file) => file.endsWith('.js'));

        for (const file of commandFiles) {
            try {
                logger.debug(`Registering command ${folder}/${file}...`);
                const command = require(`../commands/${folder}/${file}`);
                client.commands.set(command.data.name, command);
            } catch (error) {
                logger.error(`Error registering command ${folder}/${file}: ${error.message}`);
                throw error;
            }
        }
    }
};
