const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { embedColors, systemServerGuildIds } = require('../config.json');
const osu = require('node-os-utils');
const packageJson = require('../package.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Show bot status.'),
    run: async ({ interaction, client }) => {
        if (!systemServerGuildIds.includes(interaction.guildId)) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**No permission**\nThe command \`${interaction.commandName}\` cannot be executed in this server.`
                        )
                        .setColor(embedColors.colorError)
                ]
            });
        }

        const interactionLatency = Date.now() - interaction.createdTimestamp;
        const uptimeInSeconds = process.uptime();
        let uptimeDate = new Date(0);
        uptimeDate.setSeconds(uptimeInSeconds.toFixed(0));
        const uptimeString = uptimeDate.toISOString().substring(11, 19);
        const nodeProcessMemUsageInMb = (
            process.memoryUsage().heapUsed /
            1024 /
            1024
        ).toFixed(2);
        const usedMemoryInMB = Math.ceil(
            (await osu.mem.info()).usedMemMb
        ).toLocaleString('en-US');
        const cpuUsage = await osu.cpu.usage();
        const cpuCores = await osu.cpu.count();
        const platform = await osu.os.platform();
        const releaseVersion = packageJson.version;
        const discordJsVersion = packageJson.dependencies['discord.js'];
        const discordPlayerVersion = packageJson.dependencies['discord-player'];
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
                        '**System and bot status**\n' +
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
                    .setColor(embedColors.colorInfo)
            ]
        });
    }
};
