const logger = require('../../services/logger');
const config = require('config');
const embedOptions = config.get('embedOptions');
const { notValidGuildId } = require('../../utils/validation/systemCommandValidator');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    isSystemCommand: true,
    isNew: false,
    isBeta: false,
    data: new SlashCommandBuilder()
        .setName('shards')
        .setDescription('Show information about the running shards.')
        .setDMPermission(false)
        .setNSFW(false),
    execute: async ({ interaction, client }) => {
        if (await notValidGuildId(interaction)) {
            return;
        }

        let shardInfoList = [];

        await client.shard
            .broadcastEval((shardClient) => {
                /* eslint-disable no-undef */
                let playerStats = player.generateStatistics();
                let shardInfo = {
                    shardId: shardClient.shard.ids[0],
                    guildCount: shardClient.guilds.cache.size,
                    guildMemberCount: shardClient.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0),
                    playerStatistics: {
                        activeVoiceConnections: playerStats.queues.length,
                        totalTracks: playerStats.queues.reduce((acc, queue) => acc + queue.tracksCount, 0),
                        totalListeners: playerStats.queues.reduce((acc, queue) => acc + queue.listeners, 0)
                    }
                };

                return shardInfo;
            })
            .then((results) => {
                shardInfoList = results;
                logger.debug(results, `[Shard ${client.shard.ids[0]}] Fetched shardInfo from each shard.`);
            })
            .catch((error) => {
                logger.error(error, `[Shard ${client.shard.ids[0]}] Failed to fetch client values from shards.`);
            });

        systemStatusString = shardInfoList
            .map((shardInfo) => {
                string = '';
                string += `**Shard id:** \`${shardInfo.shardId}\`\n`;
                string += `**Guild count:** \`${shardInfo.guildCount}\`\n`;
                string += `**Guild member count:** \`${shardInfo.guildMemberCount}\`\n`;
                string += `**Active voice connections:** \`${shardInfo.playerStatistics.activeVoiceConnections}\`\n`;
                string += `**Total tracks:** \`${shardInfo.playerStatistics.totalTracks}\`\n`;
                string += `**Total listeners:** \`${shardInfo.playerStatistics.totalListeners}\`\n`;
                return string;
            })
            .join('\n');

        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**${embedOptions.icons.server} Shards overview**\n` + systemStatusString)
                    .setColor(embedOptions.colors.info)
                    .setFooter({ text: `Shard id for this guild: ${client.shard.ids[0]}` })
            ]
        });
    }
};
