const fs = require('node:fs');
const Discord = require('discord.js');
const logger = require('./services/logger.js');
const { EmbedBuilder } = require('discord.js');
const { Player, onBeforeCreateStream } = require('discord-player');
const { stream } = require('yt-stream');
const { embedColors } = require('./config.json');
require('dotenv').config();

// Setup required permissions for the bot to work
const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildVoiceStates
    ]
});

// Setup commands collection and load commands
// todo: extract this logic to a separate file
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

const player = new Player(client, {
    useLegacyFFmpeg: false
});

onBeforeCreateStream(async (track) => {
    if (track.source === 'youtube') {
        return (
            await stream(track.url, {
                type: 'audio',
                quality: 'high',
                highWaterMark: 1 << 25
            })
        ).stream;
    }

    return null;
});

if (process.env.NODE_ENV === 'development') {
    player.on('debug', (message) => {
        logger.debug(message);
    });

    player.events.on('debug', (message) => {
        logger.trace(message);
    });
}

player.events.on('error', (queue, error) => {
    // Emitted when the player queue encounters error
    logger.error(error, 'Player queue error event');
});

player.events.on('playerError', (queue, error) => {
    // Emitted when the audio player errors while streaming audio track
    logger.error(error, 'Player audio stream error event');
});

client.once('ready', async () => {
    // This method will load all the extractors from the @discord-player/extractor package
    await player.extractors.loadDefault();

    logger.info(`discord-player loaded dependencies:\n${player.scanDeps()}`);
    logger.info(`Logged in as ${client.user.tag}!`);
    logger.info(
        `${client.user.tag} is currently added in ${client.guilds.cache.size} guilds`
    );

    // Set Discord presence status for bot
    client.user.setActivity('/help', {
        type: Discord.ActivityType.Watching,
        name: '/help'
    });
});

client.once('reconnecting', () => {
    logger.warn('${client.user.tag} is reconnecting to Discord APIs.');
});

client.once('disconnect', () => {
    logger.warn(
        '${client.user.tag} lost connection to Discord APIs. Disconnected.'
    );
});

client.on('warn', (warning) => {
    logger.warn(warning, 'Discord client warning event');
});

client.on('error', (error) => {
    logger.error(error, 'Discord client error event');
});

client.on('guildCreate', (guild) => {
    logger.info(
        `Added to guild '${guild.name}' with ${guild.memberCount} members.`
    );
});

client.on('guildDelete', (guild) => {
    logger.info(
        `Removed from guild '${guild.name}' with ${guild.memberCount} members.`
    );
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        const inputTime = new Date();
        await interaction.deferReply();
        await command.run({ interaction, client });
        const outputTime = new Date();
        const executionTime = outputTime - inputTime;

        if (executionTime > 20000) {
            // don't send warning message for commands with collector timeouts, as collector timeout happens after 60 seconds
            if (
                (interaction.commandName === 'filters' ||
                    interaction.commandName === 'nowplaying') &&
                executionTime > 55000
            ) {
                logger.info(
                    `(${interaction.guild.memberCount}) ${interaction.guild.name}> Command '${interaction}' executed in ${executionTime} ms.`
                );
                return;
            }

            logger.warn(
                `(${interaction.guild.memberCount}) ${interaction.guild.name}> Command '${interaction}' took ${executionTime} ms to execute.`
            );

            // todo: using interaction.editReply() might lead to "unknown interaction" error
            // it might already have been replied to or deferred
            // solution might be to use interaction.followUp() instead or send a message to the channel?
            return await interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**Warning**\n**This command took ${
                                executionTime / 1000
                            } seconds to execute.**\n\n_If you experienced problems with the command, please try again._`
                        )
                        .setColor(embedColors.colorWarning)
                ]
            });
        } else {
            logger.info(
                `(${interaction.guild.memberCount}) ${interaction.guild.name}> Command '${interaction}' executed in ${executionTime} ms.`
            );
        }
    } catch (error) {
        logger.error(
            error,
            `(${interaction.guild.memberCount}) ${interaction.guild.name}> Command '${interaction}' failed to execute.`
        );

        // todo: using interaction.editReply() might lead to "unknown interaction" error
        // it might already have been replied to or deferred
        // solution might be to use interaction.followUp() instead or send a message to the channel?
        await interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**Unexpected Error**\nThere was an error while executing this command! Please try again.\n\n_If this issue persists, please submit a bug report in the bot [support server](https://discord.gg/t6Bm8wPpXB)._`
                    )
                    .setColor(embedColors.colorError)
            ]
        });
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
