const fs = require('node:fs');
const path = require('node:path');
const Discord = require('discord.js');
const logger = require(path.resolve('./src/services/logger.js'));
const { Player, onBeforeCreateStream } = require('discord-player');
const { stream } = require('yt-stream');
const { registerEventListeners } = require(path.resolve('./src/utils/registerEventListeners.js'));
require('dotenv').config();

const client = new Discord.Client({
    intents: [Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildVoiceStates],
    makeCache: Discord.Options.cacheWithLimits({
        ...Discord.Options.DefaultMakeCacheSettings,
        MessageManager: 25,
        ThreadManager: 25,
        PresenceManager: 0,
        ReactionManager: 0,
        GuildMemberManager: {
            maxSize: 50,
            keepOverLimit: (member) => member.id === client.user.id
        }
    }),
    sweepers: {
        ...Discord.Options.DefaultSweeperSettings,
        messages: {
            interval: 3600,
            lifetime: 1800
        },
        users: {
            interval: 3600,
            filter: () => (user) => user.id !== client.user.id
        }
    }
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

registerEventListeners(client, player);

(async () => {
    await player.extractors.loadDefault();
    logger.info(`discord-player loaded dependencies:\n${player.scanDeps()}`);
})();

client.login(process.env.DISCORD_BOT_TOKEN);
