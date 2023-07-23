const logger = require('../../services/logger');
const { embedOptions } = require('../../config');
const { notValidGuildId } = require('../../utils/validation/systemCommandValidator');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    isSystemCommand: true,
    isNew: false,
    isBeta: false,
    data: new SlashCommandBuilder()
        .setName('guilds')
        .setDescription('Show list of guilds where bot is added.')
        .setDMPermission(false)
        .setNSFW(false),
    execute: async ({ interaction, client }) => {
        if (await notValidGuildId(interaction)) {
            logger.debug(`[Shard ${client.shard.ids[0]}] Not a valid guild id.`);
            return;
        }

        let shardGuilds = [];
        let totalGuildCount = 0;

        await client.shard
            .broadcastEval((c) => {
                return c.guilds.cache.map((guild) => {
                    return guild;
                });
            })
            .then((guilds) => {
                shardGuilds = guilds.flat(1);
            });

        totalGuildCount = shardGuilds.length;

        let guildListFormatted = shardGuilds
            .map((guild) => {
                return {
                    name: guild.name,
                    memberCount: guild.memberCount
                };
            })
            .sort((a, b) => b.memberCount - a.memberCount)
            .slice(0, 25)
            .map((guild, index) => `${index + 1}. \`${guild.name} (#${guild.memberCount})\``)
            .join('\n');

        const totalMemberCount = shardGuilds.reduce((a, b) => a + b.memberCount, 0);

        let embedDescription =
            `**${embedOptions.icons.bot} ${
                totalGuildCount < 25 ? `Top ${totalGuildCount} guilds` : 'Top 25 guilds'
            } by member count (${totalGuildCount} total)**\n${guildListFormatted}` +
            `\n\n**Total members:** \`${totalMemberCount}\``;

        if (embedDescription.length >= 4000) {
            embedDescription = `${embedDescription.slice(0, 3996)}...`;
        }

        return await interaction.editReply({
            embeds: [new EmbedBuilder().setDescription(embedDescription).setColor(embedOptions.colors.info)]
        });
    }
};
