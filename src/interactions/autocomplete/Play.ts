import type { ILoggerService } from '@services/_types/insights/ILoggerService';
import type { IShardClient } from '@core/_types/IShardClient';
import type { AutocompleteInteraction } from 'eris';
import type { IAutocompleteCommand } from '@type/IAutocompleteCommand';

export class PlayAutocompleteCommand implements IAutocompleteCommand {
    public name = 'help';
    public aliases = ['h'];

    public async run(
        logger: ILoggerService,
        _shardClient: IShardClient,
        interaction: AutocompleteInteraction
    ): Promise<void> {
        logger.debug(`Handling '${this.name}' autocomplete command...`);
        await interaction.result([
            {
                name: `name: ${interaction.data.name}`,
                value: `value: ${interaction.data.name}`
            }
        ]);
    }
}

module.exports = new PlayAutocompleteCommand();
