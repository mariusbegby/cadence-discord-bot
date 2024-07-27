import { ShardEvents } from '@core/ShardClient';
import type { IEventHandler } from '@events/EventHandlerManager';
import type { ILoggerService } from '@services/_types/insights/ILoggerService';
import type { IShardClient } from '@core/_types/IShardClient';

export class ShardReadyEventHandler implements IEventHandler {
    eventName = ShardEvents.ShardReady;
    triggerOnce = false;

    execute(logger: ILoggerService, _shardClient: IShardClient, shardId: number) {
        logger.info(`Event '${this.eventName}' received: Shard with ID ${shardId} is ready.`);
    }
}

module.exports = new ShardReadyEventHandler();
