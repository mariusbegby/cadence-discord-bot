const fs = require('node:fs');
const logger = require('./services/logger.js');
const { REST, Routes } = require('discord.js');
const { token, clientId, systemServerGuildId } = require('./config.json');

const systemCommands = [];
const systemCommandFiles = fs
    .readdirSync('./system-commands')
    .filter((file) => file.endsWith('.js'));

for (const file of systemCommandFiles) {
    const systemCommand = require(`./system-commands/${file}`);
    systemCommands.push(systemCommand.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

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

        await rest.put(
            Routes.applicationGuildCommands(clientId, systemServerGuildId),
            {
                body: systemCommands
            }
        );

        logger.info('Successfully refreshed application (/) system commands.');
    } catch (error) {
        logger.error(
            error,
            'Failed to refresh application (/) system commands.'
        );
    }
})();
