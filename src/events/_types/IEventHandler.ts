import type { ShardClient } from '@core/ShardClient';
import type { ILoggerService } from '@type/insights/ILoggerService';

export interface IEventHandler {
    eventName: string;
    triggerOnce: boolean;
    // biome-ignore lint/suspicious/noExplicitAny: Events have different arguments and types
    handleEvent: (logger: ILoggerService, shardClient: ShardClient, ...args: any[]) => void;
}
