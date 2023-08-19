require('dotenv').config();
const logger = require('../services/logger');
const fs = require('node:fs');
const path = require('node:path');
const { REST, Routes } = require('discord.js');
const config = require('config');
const systemOptions = config.get('systemOptions');

const slashCommands = [];
const systemCommands = [];
const commandFolders = fs.readdirSync(path.resolve('./src/commands'));
for (const folder of commandFolders) {
    const commandFiles = fs
        .readdirSync(path.resolve(`./src/commands/${folder}`))
        .filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`../commands/${folder}/${file}`);
        command.isSystemCommand
            ? systemCommands.push(command.data.toJSON())
            : slashCommands.push(command.data.toJSON());
    }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
    if (!process.env.DISCORD_APPLICATION_ID || !process.env.DISCORD_BOT_TOKEN) {
        logger.error('Missing required environment variables for deployment.');
        logger.error('Provide valid DISCORD_APPLICATION_ID and DISCORD_BOT_TOKEN in .env file.');
    }

    try {
        logger.info('DEPLOYING BOT SLASH COMMANDS');
        logger.info(
            slashCommands.map((command) => command.name),
            'Bot commands found:'
        );

        logger.info('Started refreshing application (/) bot commands.');
        await refreshCommands(Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID), slashCommands);
        logger.info('Successfully refreshed application (/) bot commands.');
    } catch (error) {
        logger.error(error, 'Failed to refresh application (/) bot commands.');
    }

    try {
        logger.info('DEPLOYING SYSTEM SLASH COMMANDS');
        logger.info(
            systemCommands.map((systemCommand) => systemCommand.name),
            'System commands found:'
        );

        logger.info('Started refreshing application (/) system commands.');
        const systemGuildIds = systemOptions.systemGuildIds;
        await Promise.all(
            systemGuildIds.map((systemGuildId) => {
                logger.info(`Refreshing system commands for guild id: ${systemGuildId}.`);
                refreshCommands(
                    Routes.applicationGuildCommands(process.env.DISCORD_APPLICATION_ID, systemGuildId),
                    systemCommands
                );
            })
        );
        logger.info('Successfully refreshed application (/) system commands.');
    } catch (error) {
        logger.error(error, 'Failed to refresh application (/) system commands.');
        logger.error('Make sure the bot is in the system guilds provided.');
    }
})();

async function refreshCommands(route, commands) {
    await rest.put(route, { body: commands });
}
