const logger = require('../services/logger');
const fs = require('node:fs');
const { Collection } = require('discord.js');

exports.registerClientCommands = (client) => {
    logger.debug('Registering client commands...');

    client.commands = new Collection();
    const commandFolders = fs.readdirSync('./src/commands');
    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter((file) => file.endsWith('.js'));

        for (const file of commandFiles) {
            logger.debug(`Registering command ${folder}/${file}...`);
            const command = require(`../commands/${folder}/${file}`);
            client.commands.set(command.data.name, command);
        }
    }
};
