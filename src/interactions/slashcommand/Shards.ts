import type { ILoggerService } from '@services/_types/insights/ILoggerService';
import type { IShardClient } from '@core/_types/IShardClient';
import type { ISlashCommand } from '@interactions/_types/ISlashCommand';
import type { CommandInteraction } from 'eris';

export class ShardsCommand implements ISlashCommand {
    public commandName = 'shards';

    public async handle(
        logger: ILoggerService,
        _shardClient: IShardClient,
        _interaction: CommandInteraction
    ): Promise<void> {
        logger.debug(`Handling '${this.commandName}' command...`);

        const shardCount = _shardClient.getShardCount();
        const replyString = `**Shard count:** ${shardCount}`;
        await _interaction.createMessage(replyString);
    }
}

module.exports = new ShardsCommand();
