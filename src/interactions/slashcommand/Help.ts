import type { ILoggerService } from '@services/_types/insights/ILoggerService';
import type { IShardClient } from '@core/_types/IShardClient';
import type { ISlashCommand } from '@interactions/_types/ISlashCommand';
import type { CommandInteraction } from 'eris';

export class HelpCommand implements ISlashCommand {
    public commandName = 'help';
    public aliases = ['h'];

    public handleCommand(logger: ILoggerService, shardClient: IShardClient, _interaction: CommandInteraction): void {
        logger.debug(
            `Received help command with ID ${_interaction.id} on shard ID ${shardClient.getShardId(_interaction.guildID)}`
        );
        _interaction.createMessage('Help command invoked.');
    }
}

module.exports = new HelpCommand();
