const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { embedColors, systemServerGuildIds } = require('../config.json');

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
                            `**No permission**\nYou do not have permission to use this command.`
                        )
                        .setColor(embedColors.colorError)
                ]
            });
        }

        let uptimeInSeconds = process.uptime();
        let uptimeDate = new Date(0);
        uptimeDate.setSeconds(uptimeInSeconds.toFixed(0));
        let uptimeString = uptimeDate.toISOString().substring(11, 19);

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
                        `**Bot Status**\n` +
                            `Uptime: \`${uptimeString}\`\n` +
                            `Memory Usage: \`${(
                                process.memoryUsage().heapUsed /
                                1024 /
                                1024
                            ).toFixed(2)} MB\`\n` +
                            `Node Version: \`${process.version}\`\n` +
                            `Discord.js Version: \`v${
                                require('discord.js').version
                            }\`\n` +
                            `Discord Player Version: \`v${
                                require('discord-player').version
                            }\`\n` +
                            `Joined guilds: \`${client.guilds.cache.size}\`` +
                            `\nActive voice connections: \`${activeVoiceConnections}\``
                    )
                    .setColor(embedColors.colorInfo)
            ]
        });
    }
};
