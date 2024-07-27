import type { IShardClient } from '@type/IShardClient';
import type { ILoggerService } from '@type/insights/ILoggerService';
import type { AutocompleteInteraction } from 'eris';

export interface IAutocompleteCommand {
    name: string;
    aliases?: string[];
    run: (logger: ILoggerService, shardClient: IShardClient, interaction: AutocompleteInteraction) => Promise<void>;
}
