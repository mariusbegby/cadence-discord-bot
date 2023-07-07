const fs = require('node:fs');
const Discord = require('discord.js');
const { Player } = require('discord-player');
const { token, embedColors } = require('./config.json');

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

const systemCommandFiles = fs
    .readdirSync('./system-commands')
    .filter((file) => file.endsWith('.js'));
for (const file of systemCommandFiles) {
    const systemCommand = require(`./system-commands/${file}`);
    client.commands.set(systemCommand.data.name, systemCommand);
}

// Create a new Player, and attach it to the bot client.
const player = new Player(client, {
    ytdlOptions: {
        quality: 'highestaudio',
        highWaterMark: 1 << 25
    }
});

client.once('ready', async () => {
    console.log(
        `${new Date().toISOString().substring(11, 19)}: Info: Logged in as ${
            client.user.tag
        }!`
    );

    // This method will load all the extractors from the @discord-player/extractor package
    player.extractors.loadDefault();

    // Set Discord status
    client.user.setActivity('/help', {
        type: Discord.ActivityType.Watching,
        name: '/play'
    });

    // Show how many guilds the bot is added to
    console.log(
        `${new Date().toISOString().substring(11, 19)}: Info: ${
            client.user.tag
        } is currently added in ${client.guilds.cache.size} guilds!`
    );
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

client.on('guildCreate', (guild) => {
    console.log(
        `${new Date().toISOString().substring(11, 19)}: Info: ${
            client.user.tag
        } has been added to server '${guild.name} (#${guild.memberCount})'!`
    );
});

client.on('guildDelete', (guild) => {
    console.log(
        `${new Date().toISOString().substring(11, 19)}: Info: ${
            client.user.tag
        } was removed from server '${guild.name} (#${guild.memberCount})'!`
    );
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await interaction.deferReply();
        await command.run({ interaction, client });
        console.log(
            `${new Date().toISOString().substring(11, 19)}: ${
                interaction.guild.name
            } (#${interaction.guild.memberCount})> Command '/${
                interaction.commandName
            }' was executed successfully.`
        );
    } catch (error) {
        console.error(error);
        console.log(
            `${new Date().toISOString().substring(11, 19)}: ${
                interaction.guild.name
            } (#${interaction.guild.memberCount})> Command '/${
                interaction.commandName
            }' failed unexpectedly.`
        );

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**Error**\nThere was an error while executing this command!\n\nIf this issue persists, please submit an issue in the support server: https://discord.gg/t6Bm8wPpXB`
                    )
                    .setColor(embedColors.colorError)
            ]
        });
    }
});

client.login(token);
