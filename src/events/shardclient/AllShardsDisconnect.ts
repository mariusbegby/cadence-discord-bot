import { ShardClientEvents } from '@type/IEventHandler';
import type { IEventHandler } from '@type/IEventHandler';
import type { ILoggerService } from '@services/_types/insights/ILoggerService';
import type { IShardClient } from '@core/_types/IShardClient';

export class AllShardsDisconnectEventHandler implements IEventHandler {
    public eventName = ShardClientEvents.AllShardsDisconnect;
    public triggerOnce = false;

    public async handleEvent(logger: ILoggerService, _shardClient: IShardClient) {
        logger.info(`Event '${this.eventName}' received: All shards are disconnected.`);
    }
}

module.exports = new AllShardsDisconnectEventHandler();
