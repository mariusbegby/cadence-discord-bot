const fs = require('node:fs');
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
        console.log('DEPLOYING SYSTEM SLASH COMMANDS');
        console.log(
            'System Commands: ',
            systemCommands.map((systemCommand) => {
                return systemCommand.name;
            })
        );

        console.log('Started refreshing application (/) system commands.');

        await rest.put(
            Routes.applicationGuildCommands(clientId, systemServerGuildId),
            {
                body: systemCommands
            }
        );

        console.log('Successfully reloaded application (/) system commands.');
    } catch (error) {
        console.error(error);
    }
})();
