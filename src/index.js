const fs = require('node:fs');
const path = require('node:path');
const Discord = require('discord.js');
const logger = require(path.resolve('./src/services/logger.js'));
const { Player, onBeforeCreateStream } = require('discord-player');
const { stream } = require('yt-stream');
require('dotenv').config();

// Setup required permissions for the bot to work
const client = new Discord.Client({
    intents: [Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildVoiceStates]
});

const player = new Player(client, {
    useLegacyFFmpeg: false,
    ytdlOptions: {
        quality: 'highestaudio',
        highWaterMark: 1 << 25,
        requestOptions: {
            headers: {
                cookie: process.env.YOUTUBE_COOKIE || ''
            }
        }
    }
});

onBeforeCreateStream(async (track) => {
    if (track.source === 'youtube') {
        return (
            await stream(track.url, {
                type: 'audio',
                quality: 'high',
                highWaterMark: 1 << 25,
                cookie: process.env.YOUTUBE_COOKIE || ''
            })
        ).stream;
    }

    return null;
});

client.commands = new Discord.Collection();
const commandFolders = fs.readdirSync(path.resolve('./src/commands'));
for (const folder of commandFolders) {
    const commandFiles = fs
        .readdirSync(path.resolve(`./src/commands/${folder}`))
        .filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(path.resolve(`./src/commands/${folder}/${file}`));
        client.commands.set(command.data.name, command);
    }
}

const eventFolders = fs.readdirSync(path.resolve('./src/events'));
for (const folder of eventFolders) {
    const eventFiles = fs.readdirSync(path.resolve(`./src/events/${folder}`)).filter((file) => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(path.resolve(`./src/events/${folder}/${file}`));
        switch (folder) {
            case 'client':
                if (event.once) {
                    client.once(event.name, (...args) => event.execute(...args));
                } else {
                    if (
                        !event.isDebug ||
                        process.env.NODE_ENV === 'development' ||
                        process.env.MINIMUM_LOG_LEVEL === 'debug'
                    ) {
                        client.on(event.name, (...args) => event.execute(...args));
                    }
                }
                break;
            case 'interactions':
                client.on(event.name, (...args) => event.execute(...args, { client }));
                break;
            case 'process':
                process.on(event.name, (...args) => event.execute(...args));
                break;
            case 'player':
                if (
                    !event.isDebug ||
                    process.env.NODE_ENV === 'development' ||
                    process.env.MINIMUM_LOG_LEVEL === 'debug'
                ) {
                    if (event.isPlayerEvent) {
                        player.events.on(event.name, (...args) => event.execute(...args));
                        break;
                    } else {
                        player.on(event.name, (...args) => event.execute(...args));
                    }
                }
                break;
            default:
                logger.error(`Unknown event folder '${folder}' while trying to register events.`);
        }
    }
}

(async () => {
    await player.extractors.loadDefault();
    logger.info(`discord-player loaded dependencies:\n${player.scanDeps()}`);
})();

client.login(process.env.DISCORD_BOT_TOKEN);
