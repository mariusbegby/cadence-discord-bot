import { ShardEvents } from '@type/IEventHandler';
import type { IEventHandler } from '@type/IEventHandler';
import type { ILoggerService } from '@services/_types/insights/ILoggerService';
import type { IShardClient } from '@core/_types/IShardClient';

export class DebugEventHandler implements IEventHandler {
    public eventName = ShardEvents.Debug;
    public triggerOnce = false;

    public handleEvent(logger: ILoggerService, _shardClient: IShardClient, message: string, shardId: number) {
        logger.debug(message, `Event '${this.eventName}' received: Shard with ID ${shardId} received a debug message.`);
    }
}

module.exports = new DebugEventHandler();
