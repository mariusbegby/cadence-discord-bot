import type { ILoggerService } from '@services/_types/insights/ILoggerService';
import type { IShardClient } from '@core/_types/IShardClient';
import type { ISlashCommand } from '@interactions/_types/ISlashCommand';
import type { CommandInteraction } from 'eris';

export class StatusCommand implements ISlashCommand {
    public commandName = 'status';

    public async handle(
        logger: ILoggerService,
        _shardClient: IShardClient,
        _interaction: CommandInteraction
    ): Promise<void> {
        logger.debug(`Handling '${this.commandName}' command...`);

        const nodeProcessMemUsageInMb: number = Number.parseFloat(
            (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)
        );
        const replyString = `**Node.js memory:** ${nodeProcessMemUsageInMb.toLocaleString('en-US')} MB`;
        await _interaction.createMessage(replyString);
    }
}

module.exports = new StatusCommand();
