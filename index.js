const Discord = require('discord.js');
const { Player } = require('discord-player');
const { token } = require('./config.json');

// Setup required permissions for the bot to work
const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildVoiceStates,
        Discord.GatewayIntentBits.GuildMessageReactions
    ]
});

// Log to console when successfully logged in
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// this is the entrypoint for discord-player based application
const player = new Player(client);

// This method will load all the extractors from the @discord-player/extractor package
await player.extractors.loadDefault();

client.login(token);
