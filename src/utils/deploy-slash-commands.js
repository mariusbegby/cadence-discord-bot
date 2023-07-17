const path = require('node:path');
const fs = require('node:fs');
const logger = require(path.resolve('./src/services/logger.js'));
const { REST, Routes } = require('discord.js');
const { systemServerGuildIds } = require(path.resolve('./config.json'));
require('dotenv').config();

const slashCommands = [];
const systemCommands = [];
const commandFolders = fs.readdirSync(path.resolve('./src/commands'));
for (const folder of commandFolders) {
    const commandFiles = fs
        .readdirSync(path.resolve(`./src/commands/${folder}`))
        .filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(path.resolve(
            `./src/commands/${folder}/${file}`
        ));
        command.isSystemCommand
            ? systemCommands.push(command.data.toJSON())
            : slashCommands.push(command.data.toJSON());
    }
}

const rest = new REST({ version: '10' }).setToken(
    process.env.DISCORD_BOT_TOKEN
);

(async () => {
    try {
        logger.info('DEPLOYING BOT SLASH COMMANDS');
        logger.info(
            slashCommands.map((command) => {
                return command.name;
            }),
            'Bot commands found:'
        );

        logger.info('Started refreshing application (/) bot commands.');
        await rest.put(
            Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
            {
                body: slashCommands
            }
        );

        logger.info('Successfully refreshed application (/) bot commands.');
    } catch (error) {
        logger.error(error, 'Failed to refresh application (/) bot commands.');
    }

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
            logger.info(
                `Refreshing system commands for guild id ${systemServerGuildId}.`
            );
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
