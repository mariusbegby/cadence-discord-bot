const path = require('node:path');
const fs = require('node:fs');
const logger = require(path.resolve('./src/services/logger.js'));
const { REST, Routes } = require('discord.js');
const { systemServerGuildIds } = require(path.resolve('./config.json'));
require('dotenv').config();

const systemCommands = [];
const systemCommandFiles = fs
    .readdirSync(path.resolve('./src/system-commands'))
    .filter((file) => file.endsWith('.js'));

for (const file of systemCommandFiles) {
    const systemCommand = require(path.resolve(`./src/system-commands/${file}`));
    systemCommands.push(systemCommand.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(
    process.env.DISCORD_BOT_TOKEN
);

(async () => {
    try {
        logger.info('DEPLOYING SYSTEM SLASH COMMANDS');
        logger.info(
            systemCommands.map((systemCommand) => {
                return systemCommand.name;
            }),
            'System commands found:'
        );

        logger.info('Started refreshing application (/) system commands.');

        for (const systemServerGuildId of systemServerGuildIds) {
            await rest.put(
                Routes.applicationGuildCommands(
                    process.env.DISCORD_CLIENT_ID,
                    systemServerGuildId
                ),
                {
                    body: systemCommands
                }
            );
        }

        logger.info('Successfully refreshed application (/) system commands.');
    } catch (error) {
        logger.error(
            error,
            'Failed to refresh application (/) system commands.'
        );
    }
})();
