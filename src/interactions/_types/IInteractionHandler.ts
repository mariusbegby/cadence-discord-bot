import type { ILoggerService } from '@type/insights/ILoggerService';
import type { IShardClient } from '@type/IShardClient';
import type { CommandInteraction, AutocompleteInteraction, ComponentInteraction, PingInteraction } from 'eris';

export interface IInteractionHandler {
    handleCommandInteraction(logger: ILoggerService, shardClient: IShardClient, interaction: CommandInteraction): void;
    handleAutocompleteInteraction(
        logger: ILoggerService,
        shardClient: IShardClient,
        interaction: AutocompleteInteraction
    ): void;
    handleComponentInteraction(
        logger: ILoggerService,
        shardClient: IShardClient,
        interaction: ComponentInteraction
    ): void;
    handlePingInteraction(logger: ILoggerService, shardClient: IShardClient, interaction: PingInteraction): void;
    loadInteractionHandlers(logger: ILoggerService, interactionsPath: string): void;
}
