require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { REST, Routes } = require('discord.js');
const config = require('config');
const { v4: uuidv4 } = require('uuid');
const systemOptions = config.get('systemOptions');

const executionId = uuidv4();

const logger = require('../services/logger').child({
    source: 'deploySlashCommands.js',
    module: 'deploy',
    name: 'deploySlashCommands',
    executionId: executionId
});

const slashCommands = [];
const systemCommands = [];
const commandFolders = fs.readdirSync(path.resolve('./dist/commands'));
for (const folder of commandFolders) {
    const commandFiles = fs
        .readdirSync(path.resolve(`./dist/commands/${folder}`))
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
        logger.error(
            'Missing required environment variables for deployment.\nPlease provide valid DISCORD_APPLICATION_ID and DISCORD_BOT_TOKEN in .env file.'
        );
    }

    try {
        logger.debug(`Bot user slash commands found: ${slashCommands.map((command) => `/${command.name}`).join(', ')}`);

        logger.info('Started refreshing user slash commands.');
        await refreshCommands(Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID), slashCommands);
        logger.info('Successfully refreshed user slash commands.');
    } catch (error) {
        logger.error(error, 'Failed to refresh user slash commands.');
    }

    try {
        logger.debug(
            `Bot system slash commands found: ${systemCommands
                .map((systemCommand) => `/${systemCommand.name}`)
                .join(', ')}`
        );

        logger.info('Started refreshing system slash commands.');
        const systemGuildIds = systemOptions.systemGuildIds;
        await Promise.all(
            systemGuildIds.map((systemGuildId) => {
                logger.debug(`Refreshing system slash command for guild id '${systemGuildId}'.`);
                refreshCommands(
                    Routes.applicationGuildCommands(process.env.DISCORD_APPLICATION_ID, systemGuildId),
                    systemCommands
                );
            })
        );
        logger.info('Successfully refreshed system slash commands.');
    } catch (error) {
        logger.error(
            error,
            'Failed to refresh system slash commands. Make sure the bot is in the system guilds specified in \'systemOptions\'.'
        );
    }
})();

async function refreshCommands(route, commands) {
    await rest.put(route, { body: commands });
}
