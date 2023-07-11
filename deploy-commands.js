const fs = require('node:fs');
const logger = require('./services/logger.js');
const { REST, Routes } = require('discord.js');
const { token, clientId } = require('./config.json');

const commands = [];
const commandFiles = fs
    .readdirSync('./commands')
    .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

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

        await rest.put(Routes.applicationCommands(clientId), {
            body: commands
        });

        logger.info('Successfully refreshed application (/) bot commands.');
    } catch (error) {
        logger.error(error, 'Failed to refresh application (/) bot commands.');
    }
})();
