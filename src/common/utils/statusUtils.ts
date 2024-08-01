import osu from 'node-os-utils';
import type { ExtendedClient } from '../../types/clientTypes';
import { fetchTotalGuildStatistics, fetchTotalPlayerStatistics } from './shardUtils';
import { getUptimeFormatted } from './getUptimeFormatted';
import type { Translator } from './localeUtil';

export async function getBotStatistics(
    client: ExtendedClient,
    version: string,
    translator: Translator
): Promise<string> {
    const releaseVersion: string = version;
    const { totalGuildCount, totalMemberCount } = await fetchTotalGuildStatistics(client);

    return `${translator('statistics.botStatus.joinedServers', {
        count: totalGuildCount
    })}\n${translator('statistics.botStatus.totalMembers', {
        count: totalMemberCount
    })}\n${translator('statistics.botStatus.releaseVersion', {
        version: `v${releaseVersion}`
    })}`;
}

export async function getPlayerStatistics(client: ExtendedClient, translator: Translator): Promise<string> {
    const { totalVoiceConnections, totalTracksInQueues, totalListeners } = await fetchTotalPlayerStatistics(client);

    return `${translator('statistics.queueStatus.voiceConnections', {
        count: totalVoiceConnections
    })}\n${translator('statistics.queueStatus.tracksInQueues', {
        count: totalTracksInQueues
    })}\n${translator('statistics.queueStatus.usersListening', {
        count: totalListeners
    })}`;
}

export async function getSystemStatus(executionId: string, translator: Translator): Promise<string> {
    const uptimeString: string = getUptimeFormatted({ executionId });
    const usedMemoryInMB: number = Math.ceil((await osu.mem.info()).usedMemMb);
    const cpuUsage: number = await osu.cpu.usage();

    return `${translator('statistics.systemStatus.uptime', { value: uptimeString })}\n${translator('statistics.systemStatus.cpu', { value: cpuUsage })}\n${translator('statistics.systemStatus.memory', { value: usedMemoryInMB })}`;
}

export function getDiscordStatus(client: ExtendedClient, translator: Translator): string {
    return translator('statistics.discordStatus.apiLatency', { value: client.ws.ping });
}
