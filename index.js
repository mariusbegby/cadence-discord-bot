const fs = require('node:fs');
const Discord = require('discord.js');
const { Player } = require('discord-player');
const { token } = require('./config.json');

// Setup required permissions for the bot to work
const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildVoiceStates
    ]
});

// Setup commands collection and load commands
client.commands = new Discord.Collection();
const commandFiles = fs
    .readdirSync('./commands')
    .filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

// Create a new Player, and attach it to the bot client.
const player = new Player(client, {
    ytdlOptions: {
        quality: 'highestaudio',
        highWaterMark: 1 << 25
    }
});

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    // This method will load all the extractors from the @discord-player/extractor package
    player.extractors.loadDefault();

    // Set Discord status
    client.user.setActivity('/help', {
        type: Discord.ActivityType.Watching,
        name: '/play'
    });
});

client.once('reconnecting', () => {
    console.log('Reconnecting!');
});

client.once('disconnect', () => {
    console.log('Disconnected');
});

client.on('warn', (info) => {
    console.log(info);
});

client.on('error', console.error);

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await interaction.deferReply();
        await command.run({ interaction });
        console.log(
            `Command '/${interaction.commandName}' was executed successfully.`
        );
    } catch (error) {
        console.error(error);
        console.log(
            `Command '/${interaction.commandName}' failed unexpectedly.`
        );

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `There was an error while executing this command!`
                    )
                    .setColor('#c70057')
            ]
        });
    }
});

client.login(token);
