import type { IShardClient } from '@type/IShardClient';
import type { ILoggerService } from '@type/insights/ILoggerService';
import type { ComponentInteraction } from 'eris';

export interface IMessageComponent {
    customId: string;
    handle: (logger: ILoggerService, shardClient: IShardClient, interaction: ComponentInteraction) => Promise<void>;
}
