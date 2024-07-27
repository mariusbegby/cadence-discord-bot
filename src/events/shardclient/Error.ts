import { ShardEvents } from '@type/IEventHandler';
import type { IEventHandler } from '@type/IEventHandler';
import type { ILoggerService } from '@services/_types/insights/ILoggerService';
import type { IShardClient } from '@core/_types/IShardClient';

export class ErrorEventHandler implements IEventHandler {
    public eventName = ShardEvents.Error;
    public triggerOnce = false;

    public handleEvent(logger: ILoggerService, _shardClient: IShardClient, message: string, shardId: number) {
        logger.error(
            message,
            `Event '${this.eventName}' received: Shard with ID ${shardId} received an error message.`
        );
    }
}

module.exports = new ErrorEventHandler();
