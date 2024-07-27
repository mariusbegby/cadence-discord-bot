import type { ILoggerService } from '@services/_types/insights/ILoggerService';
import type { IShardClient } from '@core/_types/IShardClient';
import type { ISlashCommand, SlashCommandData } from '@interactions/_types/ISlashCommand';
import type { CommandInteraction } from 'eris';

export class ShardsCommand implements ISlashCommand {
    public data: SlashCommandData = {
        name: 'shards',
        description: 'Show shard count of the bot'
    };

    public async run(
        logger: ILoggerService,
        _shardClient: IShardClient,
        interaction: CommandInteraction
    ): Promise<void> {
        logger.debug(`Handling '${this.data.name}' command...`);

        const shardCount = _shardClient.getShardCount();
        const replyString = `I am currently running on **${shardCount}** shard${shardCount === 1 ? '' : 's'}.`;
        await interaction.createMessage(replyString);
    }
}

module.exports = new ShardsCommand();
