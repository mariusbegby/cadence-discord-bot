import type { IShardClient } from '@type/IShardClient';
import type { ILoggerService } from '@type/insights/ILoggerService';
import type { AutocompleteInteraction } from 'eris';

export interface IAutocompleteCommand {
    commandName: string;
    aliases?: string[];
    handle: (logger: ILoggerService, shardClient: IShardClient, interaction: AutocompleteInteraction) => Promise<void>;
}
