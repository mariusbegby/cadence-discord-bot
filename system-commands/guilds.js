const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { embedColors, systemServerGuildIds } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guilds')
        .setDescription('Show list of guilds where bot is added.')
        .setDMPermission(false),
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

        let guildsList = client.guilds.cache
            .map((guild) => {
                return {
                    name: guild.name,
                    memberCount: guild.memberCount
                };
            })
            .sort((a, b) => b.memberCount - a.memberCount)
            .map((guild) => `\`${guild.name} (#${guild.memberCount})\``)
            .join(', ');

        let embedDescription = `**Guilds (${client.guilds.cache.size} total)**\n${guildsList}`;

        if (embedDescription.length >= 4000) {
            embedDescription = `${embedDescription.slice(0, 3996)}...`;
        }

        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(embedDescription)
                    .setColor(embedColors.colorInfo)
            ]
        });
    }
};
