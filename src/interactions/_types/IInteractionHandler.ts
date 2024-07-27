import type { ILoggerService } from '@type/insights/ILoggerService';
import type { IShardClient } from '@type/IShardClient';
import type { CommandInteraction, AutocompleteInteraction, ComponentInteraction, PingInteraction } from 'eris';

export enum MessageResponseFlags {
    Ephemeral = 64
}

export interface IInteractionHandler {
    handleCommandInteraction(
        logger: ILoggerService,
        shardClient: IShardClient,
        interaction: CommandInteraction
    ): Promise<void>;
    handleAutocompleteInteraction(
        logger: ILoggerService,
        shardClient: IShardClient,
        interaction: AutocompleteInteraction
    ): Promise<void>;
    handleComponentInteraction(
        logger: ILoggerService,
        shardClient: IShardClient,
        interaction: ComponentInteraction
    ): Promise<void>;
    handlePingInteraction(
        logger: ILoggerService,
        shardClient: IShardClient,
        interaction: PingInteraction
    ): Promise<void>;
    loadInteractionHandlers(logger: ILoggerService, interactionsPath: string): void;
}
