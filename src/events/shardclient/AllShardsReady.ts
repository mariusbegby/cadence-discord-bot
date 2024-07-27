import { ShardClientEvents } from '@type/IEventHandler';
import type { IEventHandler } from '@type/IEventHandler';
import type { ILoggerService } from '@services/_types/insights/ILoggerService';
import type { IShardClient } from '@core/_types/IShardClient';

export class AllShardsReadyEventHandler implements IEventHandler {
    public eventName = ShardClientEvents.AllShardsReady;
    public triggerOnce = false;

    public handleEvent(logger: ILoggerService, _shardClient: IShardClient) {
        logger.info(`Event '${this.eventName}' received: All shards are ready.`);
    }
}

module.exports = new AllShardsReadyEventHandler();
