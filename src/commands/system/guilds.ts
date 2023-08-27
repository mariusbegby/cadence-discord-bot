import config from 'config';
import { EmbedOptions } from '../../types/configTypes';
const embedOptions: EmbedOptions = config.get('embedOptions');
import { notValidGuildId } from '../../utils/validation/systemCommandValidator';
import{ SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import loggerModule from '../../services/logger';
import { CommandParams } from '../../types/commandTypes';

module.exports = {
    isSystemCommand: true,
    isNew: false,
    isBeta: false,
    data: new SlashCommandBuilder()
        .setName('guilds')
        .setDescription('Show list of guilds where bot is added.')
        .setDMPermission(false)
        .setNSFW(false),
    execute: async ({ interaction, client, executionId }: CommandParams) => {
        const logger = loggerModule.child({
            source: 'guilds.js',
            module: 'slashCommand',
            name: '/guilds',
            executionId: executionId,
            shardId: interaction.guild.shardId,
            guildId: interaction.guild.id
        });

        if (await notValidGuildId({ interaction, executionId })) {
            return;
        }

        let shardGuilds = [];
        let totalGuildCount = 0;

        logger.debug('Fetching guilds from all shards.');
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

        logger.debug(`Successfully fetched ${totalGuildCount} guilds.`);

        const guildListFormatted = shardGuilds
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

        logger.debug('Transformed guild into into embed description.');

        if (embedDescription.length >= 4000) {
            logger.debug('Embed description is too long, truncating.');
            embedDescription = `${embedDescription.slice(0, 3996)}...`;
        }

        logger.debug('Responding with info embed.');
        return await interaction.editReply({
            embeds: [new EmbedBuilder().setDescription(embedDescription).setColor(embedOptions.colors.info)]
        });
    }
};
