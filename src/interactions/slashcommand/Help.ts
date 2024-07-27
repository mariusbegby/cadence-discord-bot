import type { ILoggerService } from '@services/_types/insights/ILoggerService';
import type { IShardClient } from '@core/_types/IShardClient';
import type { ISlashCommand, SlashCommandData } from '@type/ISlashCommand';
import type { CommandInteraction } from 'eris';

export class HelpCommand implements ISlashCommand {
    public data: SlashCommandData = {
        name: 'help',
        description: 'Show help menu'
    };

    public async run(
        logger: ILoggerService,
        _shardClient: IShardClient,
        interaction: CommandInteraction
    ): Promise<void> {
        logger.debug(`Handling '${this.data.name}' command...`);
        await interaction.createMessage("Sorry, can't help ya :/");
    }
}

module.exports = new HelpCommand();
