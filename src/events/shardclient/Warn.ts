import { ShardEvents } from '@type/IEventHandler';
import type { IEventHandler } from '@type/IEventHandler';
import type { ILoggerService } from '@services/_types/insights/ILoggerService';
import type { IShardClient } from '@core/_types/IShardClient';

export class WarnEventHandler implements IEventHandler {
    public eventName = ShardEvents.Warn;
    public triggerOnce = false;

    public async handleEvent(logger: ILoggerService, _shardClient: IShardClient, message: string, shardId: number) {
        logger.warn(
            message,
            `Event '${this.eventName}' received: Shard with ID ${shardId} received a warning message.`
        );
    }
}

module.exports = new WarnEventHandler();
