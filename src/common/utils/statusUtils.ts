import osu from 'node-os-utils';
import { ExtendedClient } from '../../types/clientTypes';
import { fetchTotalGuildStatistics, fetchTotalPlayerStatistics } from './shardUtils';
import { getUptimeFormatted } from './getUptimeFormatted';
import { TFunction } from 'i18next';

export async function getBotStatistics(
    client: ExtendedClient,
    version: string,
    translator: TFunction
): Promise<string> {
    const releaseVersion: string = version;
    const { totalGuildCount, totalMemberCount } = await fetchTotalGuildStatistics(client);

    return (
        translator('statistics.botStatus.joinedServers', {
            count: totalGuildCount
        }) +
        '\n' +
        translator('statistics.botStatus.totalMembers', {
            count: totalMemberCount
        }) +
        '\n' +
        translator('statistics.botStatus.releaseVersion', {
            version: `v${releaseVersion}`
        })
    );
}

export async function getPlayerStatistics(client: ExtendedClient, translator: TFunction): Promise<string> {
    const { totalVoiceConnections, totalTracksInQueues, totalListeners } = await fetchTotalPlayerStatistics(client);

    return (
        translator('statistics.queueStatus.voiceConnections', {
            count: totalVoiceConnections
        }) +
        '\n' +
        translator('statistics.queueStatus.tracksInQueues', {
            count: totalTracksInQueues
        }) +
        '\n' +
        translator('statistics.queueStatus.usersListening', {
            count: totalListeners
        })
    );
}

export async function getSystemStatus(executionId: string, extended: boolean, translator: TFunction): Promise<string> {
    const uptimeString: string = getUptimeFormatted({ executionId });
    const usedMemoryInMB: number = Math.ceil((await osu.mem.info()).usedMemMb);
    const cpuUsage: number = await osu.cpu.usage();
    if (!extended) {
        return (
            translator('statistics.systemStatus.uptime', { value: uptimeString }) +
            '\n' +
            translator('statistics.systemStatus.cpu', { value: cpuUsage }) +
            '\n' +
            translator('statistics.systemStatus.memory', { value: usedMemoryInMB })
        );
    }

    const totalMemoryInMb: number = Math.ceil((await osu.mem.info()).totalMemMb);
    const cpuCores: number = osu.cpu.count();
    const platform: string = osu.os.platform();

    return (
        translator('statistics.systemStatus.platform', { value: platform }) +
        '\n' +
        translator('statistics.systemStatus.uptime', { value: uptimeString }) +
        '\n' +
        translator('statistics.systemStatus.cpuDetailed', { usage: cpuUsage, cores: cpuCores }) +
        '\n' +
        translator('statistics.systemStatus.memoryDetailed', { used: usedMemoryInMB, total: totalMemoryInMb })
    );
}

export function getDiscordStatus(client: ExtendedClient, translator: TFunction): string {
    return translator('statistics.discordStatus.apiLatency', { value: client.ws.ping });
}
