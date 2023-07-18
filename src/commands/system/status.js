const { embedOptions } = require('../../config');
const { notValidGuildId } = require('../../utils/validation/systemCommandValidation');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const osu = require('node-os-utils');
const { version, dependencies } = require('../../../package.json');

module.exports = {
    isSystemCommand: true,
    data: new SlashCommandBuilder().setName('status').setDescription('Show bot status.').setDMPermission(false),
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
        client.guilds.cache.forEach((guild) => {
            const queue = useQueue(guild.id);

            if (queue) {
                activeVoiceConnections++;
            }
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
                            `Joined guilds: \`${client.guilds.cache.size}\``
                    )
                    .setColor(embedOptions.colors.info)
            ]
        });
    }
};
