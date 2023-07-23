const logger = require('../../services/logger');
const { embedOptions } = require('../../config');
const { notValidGuildId } = require('../../utils/validation/systemCommandValidator');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const osu = require('node-os-utils');
const { version, dependencies } = require('../../../package.json');

module.exports = {
    isSystemCommand: true,
    isNew: false,
    isBeta: false,
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Show bot status.')
        .setDMPermission(false)
        .setNSFW(false),
    execute: async ({ interaction, client }) => {
        if (await notValidGuildId(interaction)) {
            return;
        }

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
        let activeVoiceConnections = 0;
        let guildCount = 0;

        await client.shard
            .broadcastEval((c) => {
                return c.guilds.cache.map((guild) => {
                    return guild.id;
                    /*
                    const queue = useQueue(guild.id);
                    let shardVoiceConnections = 0;
                    if (queue) {
                        activeVoiceConnections++;
                    }
                    return shardVoiceConnections;
                    */
                });
            })
            .then((results) => {
                // array of arrays with guild ids for each shard
                logger.debug(results, 'Shard guild ids');
            });

        /*
        client.guilds.cache.forEach((guild) => {
            const queue = useQueue(guild.id);

            if (queue) {
                activeVoiceConnections++;
            }
        });
        */

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
                            `Joined guilds: \`${guildCount}\``
                    )
                    .setColor(embedOptions.colors.info)
            ]
        });
    }
};
