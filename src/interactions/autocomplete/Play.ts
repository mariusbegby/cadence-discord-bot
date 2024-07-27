import type { ILoggerService } from '@services/_types/insights/ILoggerService';
import type { IShardClient } from '@core/_types/IShardClient';
import type { AutocompleteInteraction } from 'eris';
import type { IAutocompleteCommand } from '@type/IAutocompleteCommand';

export class PlayAutocompleteCommand implements IAutocompleteCommand {
    public commandName = 'help';
    public aliases = ['h'];

    public async handle(
        logger: ILoggerService,
        _shardClient: IShardClient,
        _interaction: AutocompleteInteraction
    ): Promise<void> {
        logger.debug(`Handling '${this.commandName}' autocomplete command...`);
        await _interaction.result([
            {
                name: `name: ${_interaction.data.name}`,
                value: `value: ${_interaction.data.name}`
            }
        ]);
    }
}

module.exports = new PlayAutocompleteCommand();
