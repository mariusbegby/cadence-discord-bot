import type { IShardClient } from '@type/IShardClient';
import type { ILoggerService } from '@type/insights/ILoggerService';
import type { CommandInteraction } from 'eris';
import type Eris from 'eris';

export type SlashCommandData = {} & Omit<Eris.ChatInputApplicationCommand, 'application_id' | 'type' | 'id'>;

export interface ISlashCommand {
    data: SlashCommandData;
    run: (logger: ILoggerService, shardClient: IShardClient, interaction: CommandInteraction) => Promise<void>;
}
