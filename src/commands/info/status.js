const logger = require('../../services/logger');
const { embedOptions } = require('../../config');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const osu = require('node-os-utils');
const { version, dependencies } = require('../../../package.json');

module.exports = {
    isNew: true,
    isBeta: false,
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Show the bot and system status.')
        .setDMPermission(false)
        .setNSFW(false),
    execute: async ({ interaction, client }) => {
        const interactionLatency = Date.now() - interaction.createdTimestamp;
        const uptimeInSeconds = process.uptime();
        let uptimeDate = new Date(0);
        uptimeDate.setSeconds(uptimeInSeconds.toFixed(0));
        const uptimeString = uptimeDate.toISOString().substring(11, 19);
        const nodeProcessMemUsageInMb = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const usedMemoryInMB = Math.ceil((await osu.mem.info()).usedMemMb).toLocaleString('en-US');
        const cpuUsage = await osu.cpu.usage();
        const cpuCores = await osu.cpu.count();
        const platform = await osu.os.platform();
        const releaseVersion = version;
        const discordJsVersion = dependencies['discord.js'];
        const discordPlayerVersion = dependencies['discord-player'];
        const discordApiLatency = client.ws.ping;
        let guildCount = 0;
        let activeVoiceConnections = 0;
        let totalTracks = 0;
        let totalListeners = 0;

        await client.shard
            .broadcastEval(() => {
                /* eslint-disable no-undef */
                return player.generateStatistics();
            })
            .then((results) => {
                let queueCountList = [];
                let trackCountList = [];
                let listenerCountList = [];
                results.map((result) => {
                    queueCountList.push(result.queues.length);
                    if (result.queues.length > 0) {
                        result.queues.map((queue) => {
                            trackCountList.push(queue.status.playing ? queue.tracksCount + 1 : queue.tracksCount);
                            listenerCountList.push(queue.listeners);
                        });
                    }
                });

                activeVoiceConnections = queueCountList.reduce((acc, queueAmount) => acc + queueAmount, 0);
                totalTracks = trackCountList.reduce((acc, trackAmount) => acc + trackAmount, 0);
                totalListeners = listenerCountList.reduce((acc, listenerAmount) => acc + listenerAmount, 0);
            });

        await client.shard
            .fetchClientValues('guilds.cache.size')
            .then((results) => {
                guildCount = results.reduce((acc, guildCount) => acc + guildCount, 0);
            })
            .catch((error) => {
                logger.error(error, `[Shard ${client.shard.ids[0]}] Failed to fetch client values from shards.`);
            });

        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${embedOptions.icons.bot} System and bot status**\n` +
                            `Uptime: \`${uptimeString}\`\n` +
                            `Platform: \`${platform}\`\n` +
                            `CPU cores: \`${cpuCores}\`\n` +
                            `CPU usage: \`${cpuUsage}%\`\n` +
                            `Node.js mem usage: \`${nodeProcessMemUsageInMb} MB\`\n` +
                            `System mem usage: \`${usedMemoryInMB} MB\`\n` +
                            `Bot version: \`v${releaseVersion}\`\n` +
                            `Node.js version: \`${process.version}\`\n` +
                            `Discord.js version: \`${discordJsVersion}\`\n` +
                            `Discord-player version: \`${discordPlayerVersion}\`\n` +
                            `Discord API latency: \`${discordApiLatency} ms\`\n` +
                            `Interaction latency: \`${interactionLatency} ms\`\n` +
                            `Active voice connections: \`${activeVoiceConnections}\`\n` +
                            `Total tracks in queues: \`${totalTracks}\`\n` +
                            `Total listeners: \`${totalListeners}\`\n` +
                            `Joined guilds: \`${guildCount}\``
                    )
                    .setColor(embedOptions.colors.info)
            ]
        });
    }
};
