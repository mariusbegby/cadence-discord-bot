import osu from 'node-os-utils';
import { ExtendedClient } from '../types/clientTypes';
import { fetchTotalGuildStatistics, fetchTotalPlayerStatistics } from '../utils/shardUtils';
import { getUptimeFormatted } from '../utils/system/getUptimeFormatted';

export async function getBotStatistics(client: ExtendedClient, version: string): Promise<string> {
    const releaseVersion: string = version;
    const { totalGuildCount, totalMemberCount } = await fetchTotalGuildStatistics(client);

    return (
        `**${totalGuildCount.toLocaleString('en-US')}** Joined servers\n` +
        `**${totalMemberCount.toLocaleString('en-US')}** Total members\n` +
        `**v${releaseVersion}** Release version`
    );
}

export async function getPlayerStatistics(client: ExtendedClient): Promise<string> {
    const { totalVoiceConnections, totalTracksInQueues, totalListeners } = await fetchTotalPlayerStatistics(client);

    return (
        `**${totalVoiceConnections.toLocaleString('en-US')}** Voice connections\n` +
        `**${totalTracksInQueues.toLocaleString('en-US')}** Tracks in queues\n` +
        `**${totalListeners.toLocaleString('en-US')}** Users listening`
    );
}

export async function getSystemStatus(executionId: string, extended: boolean): Promise<string> {
    if (!extended) {
        const uptimeString: string = getUptimeFormatted({ executionId });
        const usedMemoryInMB: string = Math.ceil((await osu.mem.info()).usedMemMb).toLocaleString('en-US');
        const cpuUsage: number = await osu.cpu.usage();

        return (
            `**${uptimeString}** Uptime\n` + `**${cpuUsage}%** CPU usage\n` + `**${usedMemoryInMB} MB** Memory usage`
        );
    }

    const uptimeString: string = getUptimeFormatted({ executionId });
    const totalMemoryInMb: string = Math.ceil((await osu.mem.info()).totalMemMb).toLocaleString('en-US');
    const cpuCores: number = osu.cpu.count();
    const platform: string = osu.os.platform();
    const usedMemoryInMB: string = Math.ceil((await osu.mem.info()).usedMemMb).toLocaleString('en-US');
    const cpuUsage: number = await osu.cpu.usage();

    return (
        `**${platform}** Platform\n` +
        `**${uptimeString}** Uptime\n` +
        `**${cpuUsage}% @ ${cpuCores} cores** CPU usage\n` +
        `**${usedMemoryInMB} / ${totalMemoryInMb} MB** Memory usage`
    );
}

export function getDiscordStatus(client: ExtendedClient): string {
    return `**${client!.ws.ping} ms** Discord API latency`;
}
