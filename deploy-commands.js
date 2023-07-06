const fs = require('node:fs');
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
        console.log("DEPLOYING BOT SLASH COMMANDS");
        console.log("Commands: ", commands.map((command) => {return command.name}));

        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(clientId), {
            body: commands
        });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
