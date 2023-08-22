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
        .setNSFW(false)
        .addBooleanOption((option) =>
            option
                .setName('sort')
                .setDescription('Whether or not to sort by most active voice connections.')
                .setRequired(false)
        )
        .addNumberOption((option) => option.setName('page').setDescription('Page number to show').setMinValue(1)),
    execute: async ({ interaction, client }) => {
        if (await notValidGuildId(interaction)) {
            return;
        }

        let shardInfoList = [];

        await client.shard
            .broadcastEval((shardClient) => {
                /* eslint-disable no-undef */
                let playerStats = player.generateStatistics();
                const nodeProcessMemUsageInMb = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
                let shardInfo = {
                    shardId: shardClient.shard.ids[0],
                    memUsage: nodeProcessMemUsageInMb,
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
                const sortByActiveConnections = interaction.options.getBoolean('sort', false);
                if (sortByActiveConnections) {
                    shardInfoList = shardInfoList.sort(
                        (a, b) => b.playerStatistics.activeVoiceConnections - a.playerStatistics.activeVoiceConnections
                    );
                }
                logger.debug(`[Shard ${client.shard.ids[0]}] Fetched shardInfo from each shard.`);
            })
            .catch((error) => {
                logger.error(error, `[Shard ${client.shard.ids[0]}] Failed to fetch client values from shards.`);
            });

        const shardCount = shardInfoList.length;
        const totalPages = Math.ceil(shardCount / 10) || 1;
        const pageIndex = (interaction.options.getNumber('page') || 1) - 1;

        const currentPageShards = shardInfoList.slice(pageIndex * 10, pageIndex * 10 + 10);

        const evenShardIndexes = currentPageShards.filter((shard, index) => index % 2 === 0);
        const oddShardIndexes = currentPageShards.filter((shard, index) => index % 2 !== 0);

        function shardInfoToString(shard) {
            let string = '';
            string += `**Shard ${shard.shardId}** - Guilds: ${shard.guildCount.toLocaleString(
                'en-US'
            )} (${shard.guildMemberCount.toLocaleString('en-US')})\n`;
            string += `**Node.js memory:** ${shard.memUsage.toLocaleString('en-US')} MB\n`;
            string += `**┣** Connections: ${shard.playerStatistics.activeVoiceConnections.toLocaleString('en-US')}\n`;
            string += `**┣** Tracks: ${shard.playerStatistics.totalTracks.toLocaleString('en-US')}\n`;
            string += `**┗** Listeners: ${shard.playerStatistics.totalListeners.toLocaleString('en-US')}\n`;
            return string;
        }

        const evenShardIndexesString = evenShardIndexes.map(shardInfoToString).join('\n') + 'ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ';
        const oddShardIndexesString = oddShardIndexes.map(shardInfoToString).join('\n');

        const embedFields = [];

        if (currentPageShards.length === 1) {
            embedFields.push({
                name: ' ',
                value: currentPageShards.map(shardInfoToString).join('\n'),
                inline: false
            });
        } else {
            embedFields.push(
                {
                    name: ' ',
                    value: evenShardIndexesString,
                    inline: true
                },
                {
                    name: ' ',
                    value: oddShardIndexesString,
                    inline: true
                }
            );
        }

        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**${embedOptions.icons.server} Shard overview - ${shardCount} total shards**\n`)
                    .addFields(...embedFields)
                    .setColor(embedOptions.colors.info)
                    .setFooter({ text: `Shard id: ${client.shard.ids[0]}, page ${pageIndex + 1} of ${totalPages}` })
            ]
        });
    }
};
