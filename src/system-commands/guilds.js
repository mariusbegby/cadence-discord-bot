const path = require('node:path');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const {
    embedColors,
    embedIcons,
    systemServerGuildIds
} = require(path.resolve('./config.json'));

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
                            `**${embedIcons.warning} Oops!**\nNo permission to execute this command.\n\nThe command \`${interaction.commandName}\` cannot be executed in this server.`
                        )
                        .setColor(embedColors.colorWarning)
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
            .slice(0, 50)
            .map(
                (guild, index) =>
                    `${index + 1}. \`${guild.name} (#${guild.memberCount})\``
            )
            .join('\n');

        let embedDescription = `**${embedIcons.bot} ${
            client.guilds.cache.size < 50
                ? `Top ${client.guilds.cache.size} guilds`
                : 'Top 50 guilds'
        } by member count (${client.guilds.cache.size} total)**\n${guildsList}`;

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
