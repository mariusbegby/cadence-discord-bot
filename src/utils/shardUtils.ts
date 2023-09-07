import { GuildQueueStatisticsMetadata } from 'discord-player';
import { Client, Guild } from 'discord.js';
import { PlayerStatistics, ShardPlayerStatistics } from '../types/utilTypes';

async function fetchGuildsPerShard(client?: Client): Promise<Map<string, Guild>[]> {
    if (!client || !client.shard) {
        throw new Error('Client is undefined or not sharded.');
    }

    try {
        return (await client.shard.fetchClientValues('guilds.cache')) as Map<string, Guild>[];
    } catch (error) {
        throw new Error('Failed to fetch client values from shards.');
    }
}

function calculateTotalCountForShard(guildListMap: Map<string, Guild>) {
    const guildList: Guild[] = [...guildListMap.values()];

    const totalGuildCount: number = guildList.length;
    const totalMemberCount: number = guildList.reduce((acc: number, guild: Guild) => acc + guild.memberCount, 0);

    return { totalGuildCount, totalMemberCount };
}

function calculateTotalCountForAllShards(guildListPerShard: Map<string, Guild>[]) {
    return guildListPerShard.reduce(
        (totals, guildList) => {
            const { totalGuildCount, totalMemberCount } = calculateTotalCountForShard(guildList);
            totals.totalGuildCount += totalGuildCount;
            totals.totalMemberCount += totalMemberCount;

            return totals;
        },
        { totalGuildCount: 0, totalMemberCount: 0 }
    );
}

export async function fetchTotalGuildStatistics(client?: Client) {
    const guildsPerShard: Map<string, Guild>[] = await fetchGuildsPerShard(client);
    const { totalGuildCount, totalMemberCount } = calculateTotalCountForAllShards(guildsPerShard);

    return { totalGuildCount, totalMemberCount };
}

async function fetchPlayerStatisticsPerShard(client?: Client): Promise<PlayerStatistics[]> {
    if (!client || !client.shard) {
        throw new Error('Client is undefined or not sharded.');
    }

    try {
        const playerStatisticsPerShard: PlayerStatistics[] = await client.shard.broadcastEval(() => {
            /* eslint-disable no-undef */
            return player.generateStatistics();
        });
        return playerStatisticsPerShard;
    } catch (error) {
        throw new Error('Failed to fetch player statistics from shards.');
    }
}

function calculateTotalPlayerStatisticsForShard(result: PlayerStatistics): ShardPlayerStatistics {
    const totalVoiceConnections = result.queues.length;
    let totalTracksInQueues = 0;
    let totalListeners = 0;

    result.queues.map((queue: GuildQueueStatisticsMetadata) => {
        totalTracksInQueues += queue.status.playing ? queue.tracksCount + 1 : queue.tracksCount;
        totalListeners += queue.listeners;
    });

    return { totalVoiceConnections, totalTracksInQueues, totalListeners };
}

function calculateTotalPlayerStatisticsForAllShards(results: PlayerStatistics[]): ShardPlayerStatistics {
    return results.reduce(
        (totals: ShardPlayerStatistics, result: PlayerStatistics) => {
            const { totalVoiceConnections, totalTracksInQueues, totalListeners } =
                calculateTotalPlayerStatisticsForShard(result);
            totals.totalVoiceConnections += totalVoiceConnections;
            totals.totalTracksInQueues += totalTracksInQueues;
            totals.totalListeners += totalListeners;

            return totals;
        },
        { totalVoiceConnections: 0, totalTracksInQueues: 0, totalListeners: 0 }
    );
}

export async function fetchTotalPlayerStatistics(client?: Client): Promise<ShardPlayerStatistics> {
    const results: PlayerStatistics[] = await fetchPlayerStatisticsPerShard(client);
    return calculateTotalPlayerStatisticsForAllShards(results);
}
