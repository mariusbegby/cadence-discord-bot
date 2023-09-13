import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    EmbedField,
    EmbedFooterData,
    SlashCommandBuilder
} from 'discord.js';
import { BaseSlashCommandInteraction } from '../../../classes/interactions';
import { ExtendedClient } from '../../../types/clientTypes';
import { BaseSlashCommandParams, BaseSlashCommandReturnType, ShardInfo } from '../../../types/interactionTypes';
import { checkValidGuildId } from '../../../utils/validation/systemCommandValidator';
import { Logger } from 'pino';

class ShardsCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = new SlashCommandBuilder()
            .setName('shards')
            .setDescription('Show information about all connected shards.')
            .addStringOption((option) =>
                option
                    .setName('sort')
                    .setDescription('What to sort the shards by.')
                    .setRequired(false)
                    .addChoices(
                        { name: 'None (Shard ID)', value: 'none' },
                        { name: 'Memory usage', value: 'memory' },
                        { name: 'Voice Connections', value: 'connections' },
                        { name: 'Tracks', value: 'tracks' },
                        { name: 'Listeners', value: 'listeners' },
                        { name: 'Guilds', value: 'guilds' },
                        { name: 'Members', value: 'members' }
                    )
            )
            .addNumberOption((option) =>
                option.setName('page').setDescription('Page number to display for the shards').setMinValue(1)
            );
        const isSystemCommand: boolean = true;
        super(data, isSystemCommand);
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, interaction, client } = params;
        const logger = this.getLogger(this.name, executionId, interaction);

        await this.runValidators({ interaction, executionId }, [checkValidGuildId]);

        const shardInfoList: ShardInfo[] = await this.fetchShardInfo(
            client!,
            logger,
            interaction.options.getString('sort')
        );

        const currentShardId: number = client!.shard!.ids[0];
        const shardCount: number = shardInfoList.length;
        const pageIndex: number = this.getPageIndex(interaction);
        const totalPages: number = this.getTotalPages(shardCount);

        if (pageIndex > totalPages - 1) {
            return await this.handleInvalidPage(logger, interaction, pageIndex, totalPages);
        }

        const currentPageShards: ShardInfo[] = shardInfoList.slice(pageIndex * 10, pageIndex * 10 + 10);
        const embedFields: EmbedField[] = this.buildEmbedFields(currentPageShards);

        logger.debug('Responding with info embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${this.embedOptions.icons.server} Shard overview - ${shardCount} total shards**\n`
                    )
                    .addFields(...embedFields)
                    .setColor(this.embedOptions.colors.info)
                    .setFooter(this.getFooterPageInfo(currentShardId, pageIndex, totalPages))
            ]
        });
    }

    private async fetchShardInfo(
        client: ExtendedClient,
        logger: Logger,
        sortOption: string | null
    ): Promise<ShardInfo[]> {
        let shardInfoList: ShardInfo[] = [];

        logger.debug('Fetching player statistics and client values from each shard.');
        try {
            await client!
                .shard!.broadcastEval((shardClient: ExtendedClient) => {
                    const playerStats = player.generateStatistics();
                    const nodeProcessMemUsageInMb: number = parseFloat(
                        (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)
                    );

                    const shardInfo: ShardInfo = {
                        shardId: shardClient.shard!.ids[0],
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
                    shardInfoList = results.filter(Boolean) as ShardInfo[];
                    shardInfoList = this.sortShardInfoList(shardInfoList, sortOption);
                    logger.debug('Successfully fetched player statistics and client values from shards.');
                });
        } catch (error) {
            logger.error(error, 'Failed to fetch player statistics and client values from shards.');
            throw error;
        }

        return shardInfoList;
    }

    private buildEmbedFields(shards: ShardInfo[]): EmbedField[] {
        const evenShardIndexes: ShardInfo[] = shards.filter((shard, index) => index % 2 === 0);
        const oddShardIndexes: ShardInfo[] = shards.filter((shard, index) => index % 2 !== 0);

        const evenShardIndexesString: string =
            evenShardIndexes.map(this.shardInfoToString).join('\n') + 'ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ';
        const oddShardIndexesString: string = oddShardIndexes.map(this.shardInfoToString).join('\n');

        const embedFields: EmbedField[] = [];

        if (shards.length === 1) {
            embedFields.push({
                name: ' ',
                value: shards.map(this.shardInfoToString).join('\n'),
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

        return embedFields;
    }

    private sortShardInfoList(shardInfoList: ShardInfo[], sortOption: string | null): ShardInfo[] {
        switch (sortOption) {
            case 'memory':
                return shardInfoList.sort((a, b) => b.memUsage - a.memUsage);
            case 'connections':
                return shardInfoList.sort(
                    (a, b) => b.playerStatistics.activeVoiceConnections - a.playerStatistics.activeVoiceConnections
                );
            case 'tracks':
                return shardInfoList.sort((a, b) => b.playerStatistics.totalTracks - a.playerStatistics.totalTracks);
            case 'listeners':
                return shardInfoList.sort(
                    (a, b) => b.playerStatistics.totalListeners - a.playerStatistics.totalListeners
                );
            case 'guilds':
                return shardInfoList.sort((a, b) => b.guildCount - a.guildCount);
            case 'members':
                return shardInfoList.sort((a, b) => b.guildMemberCount - a.guildMemberCount);
            default:
                return shardInfoList.sort((a, b) => a.shardId - b.shardId);
        }
    }

    private shardInfoToString(shard: ShardInfo): string {
        let string: string = '';
        string += `**Shard ${shard.shardId}** - Guilds: ${shard.guildCount.toLocaleString(
            'en-US'
        )} (${shard.guildMemberCount.toLocaleString('en-US')})\n`;
        string += `**Node.js memory:** ${shard.memUsage.toLocaleString('en-US')} MB\n`;
        string += `**┣** Connections: ${shard.playerStatistics.activeVoiceConnections.toLocaleString('en-US')}\n`;
        string += `**┣** Tracks: ${shard.playerStatistics.totalTracks.toLocaleString('en-US')}\n`;
        string += `**┗** Listeners: ${shard.playerStatistics.totalListeners.toLocaleString('en-US')}\n`;
        return string;
    }

    private getPageIndex(interaction: ChatInputCommandInteraction): number {
        return (interaction.options.getNumber('page') || 1) - 1;
    }

    private getTotalPages(shardCount: number): number {
        return Math.ceil(shardCount / 10) || 1;
    }

    private getFooterPageInfo(currentShardId: number, pageIndex: number, totalPages: number): EmbedFooterData {
        return { text: `Shard id: ${currentShardId}, page ${pageIndex + 1} of ${totalPages}` };
    }

    private async handleInvalidPage(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        pageIndex: number,
        totalPages: number
    ) {
        logger.debug('Specified page was higher than total pages.');

        logger.debug('Responding with warning embed.');
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${this.embedOptions.icons.warning} Oops!**\n` +
                            `Page **\`${pageIndex + 1}\`** is not a valid page number.\n\n` +
                            `There are only a total of **\`${totalPages}\`** pages available.`
                    )
                    .setColor(this.embedOptions.colors.warning)
            ]
        });
        return Promise.resolve();
    }
}

export default new ShardsCommand();
