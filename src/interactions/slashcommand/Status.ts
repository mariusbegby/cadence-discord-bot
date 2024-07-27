import type { ILoggerService } from '@services/_types/insights/ILoggerService';
import type { IShardClient } from '@core/_types/IShardClient';
import type { ISlashCommand, SlashCommandData } from '@interactions/_types/ISlashCommand';
import type { CommandInteraction } from 'eris';

export class StatusCommand implements ISlashCommand {
    public data: SlashCommandData = {
        name: 'status',
        description: 'Show status of the bot'
    };

    public async run(
        logger: ILoggerService,
        _shardClient: IShardClient,
        _interaction: CommandInteraction
    ): Promise<void> {
        logger.debug(`Handling '${this.data.name}' command...`);

        const nodeProcessMemUsageInMb: number = Number.parseFloat(
            (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)
        );
        const uptimeFormatted = this._getUptime();
        const replyString =
            `**Uptime:** ${uptimeFormatted}\n` +
            `**Node.js memory:** ${nodeProcessMemUsageInMb.toLocaleString('en-US')} MB`;
        await _interaction.createMessage(replyString);
    }

    private _getUptime(): string {
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        let uptimeString = '';
        if (days > 0) {
            uptimeString += `${days} day${days === 1 ? '' : 's'}, `;
        }
        if (hours > 0) {
            uptimeString += `${hours} hour${hours === 1 ? '' : 's'}, `;
        }
        if (minutes > 0) {
            uptimeString += `${minutes} minute${minutes === 1 ? '' : 's'}, `;
        }
        if (seconds > 0) {
            uptimeString += `${seconds} second${seconds === 1 ? '' : 's'}`;
        }

        return uptimeString;
    }
}

module.exports = new StatusCommand();
