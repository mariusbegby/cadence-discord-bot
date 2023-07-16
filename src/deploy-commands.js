const path = require('path');
const fs = require('node:fs');
const logger = require(path.resolve('./src/services/logger.js'));
const { REST, Routes } = require('discord.js');
require('dotenv').config();

const commands = [];
const commandFiles = fs
    .readdirSync(path.resolve('./src/commands'))
    .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(path.resolve(`./src/commands/${file}`));
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(
    process.env.DISCORD_BOT_TOKEN
);

(async () => {
    try {
        logger.info('DEPLOYING BOT SLASH COMMANDS');
        logger.info(
            commands.map((commands) => {
                return commands.name;
            }),
            'Bot commands found:'
        );

        logger.info('Started refreshing application (/) bot commands.');

        await rest.put(
            Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
            {
                body: commands
            }
        );

        logger.info('Successfully refreshed application (/) bot commands.');
    } catch (error) {
        logger.error(error, 'Failed to refresh application (/) bot commands.');
    }
})();
