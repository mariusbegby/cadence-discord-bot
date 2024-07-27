import type { ISlashCommand } from '@type/ISlashCommand';
import type Eris from 'eris';

export interface IShardClient {
    start(): Promise<void>;
    registerEventListener(eventName: string, once: boolean, listener: () => void): void;
    removeAllListeners(): void;
    setMaxListeners(maxListeners: number): void;
    getShardId(guildId: string | undefined): number;
    getShardCount(): number;
    getTotalShardCount(): number;
    deployCommand(command: ISlashCommand): Promise<Eris.ApplicationCommand>;
    getCommands(): Promise<Eris.ApplicationCommand[]>;
    deleteCommands(): Promise<void>;
}
