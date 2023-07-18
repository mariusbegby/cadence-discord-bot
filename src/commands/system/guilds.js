const { embedOptions, systemOptions } = require('../../config');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    isSystemCommand: true,
    data: new SlashCommandBuilder()
        .setName('guilds')
        .setDescription('Show list of guilds where bot is added.')
        .setDMPermission(false),
    execute: async ({ interaction, client }) => {
        if (!systemOptions.systemGuildIds.includes(interaction.guildId)) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${embedOptions.icons.warning} Oops!**\nNo permission to execute this command.\n\nThe command \`${interaction.commandName}\` cannot be executed in this server.`
                        )
                        .setColor(embedOptions.colors.warning)
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
            .map((guild, index) => `${index + 1}. \`${guild.name} (#${guild.memberCount})\``)
            .join('\n');

        const totalMemberCount = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0);

        let embedDescription =
            `**${embedOptions.icons.bot} ${
                client.guilds.cache.size < 50 ? `Top ${client.guilds.cache.size} guilds` : 'Top 50 guilds'
            } by member count (${client.guilds.cache.size} total)**\n${guildsList}` +
            `\n\n**Total members:** \`${totalMemberCount}\``;

        if (embedDescription.length >= 4000) {
            embedDescription = `${embedDescription.slice(0, 3996)}...`;
        }

        return await interaction.editReply({
            embeds: [new EmbedBuilder().setDescription(embedDescription).setColor(embedOptions.colors.info)]
        });
    }
};
