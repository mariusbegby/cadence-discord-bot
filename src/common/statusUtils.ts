import osu from 'node-os-utils';
import { ExtendedClient } from '../types/clientTypes';
import { fetchTotalGuildStatistics, fetchTotalPlayerStatistics } from '../utils/shardUtils';
import { getUptimeFormatted } from '../utils/system/getUptimeFormatted';

export async function getBotStatistics(client: ExtendedClient): Promise<string> {
    const { totalGuildCount, totalMemberCount } = await fetchTotalGuildStatistics(client);

    return (
        `Aku uda bergabung di **${totalGuildCount.toLocaleString('id-ID')}** server(s)\n` +
        `Aku uda bertemu dengan **${totalMemberCount.toLocaleString('id-ID')}** user(s)`
    );
}

export async function getPlayerStatistics(client: ExtendedClient): Promise<string> {
    const { totalVoiceConnections, totalTracksInQueues, totalListeners } = await fetchTotalPlayerStatistics(client);

    return (
        `Ada **${totalVoiceConnections.toLocaleString('id-ID')}** voice(s) terhubung dengan-ku\n` +
        `Ada **${totalTracksInQueues.toLocaleString('id-ID')}** track(s) dalam antrian-ku\n` +
        `Ada **${totalListeners.toLocaleString('id-ID')}** user(s) sedang mendengarkan-ku`
    );
}

export async function getSystemStatus(executionId: string, extended: boolean): Promise<string> {
    if (!extended) {
        const uptimeString: string = getUptimeFormatted({ executionId });
        const usedMemoryInMB: string = Math.ceil((await osu.mem.info()).usedMemMb).toLocaleString('id-ID');
        const cpuUsage: number = await osu.cpu.usage();

        return (
            `**${uptimeString}** Uptime\n` + `**${cpuUsage}%** CPU usage\n` + `**${usedMemoryInMB} MB** Memory Usage`
        );
    }

    const uptimeString: string = getUptimeFormatted({ executionId });
    const totalMemoryInMb: string = Math.ceil((await osu.mem.info()).totalMemMb).toLocaleString('id-ID');
    const cpuCores: number = osu.cpu.count();
    const platform: string = osu.os.platform();
    const usedMemoryInMB: string = Math.ceil((await osu.mem.info()).usedMemMb).toLocaleString('id-ID');
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
