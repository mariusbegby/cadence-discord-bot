import { ShardClientEvents } from '@type/IEventHandler';
import type { IEventHandler } from '@type/IEventHandler';
import type { ILoggerService } from '@services/_types/insights/ILoggerService';
import type { IShardClient } from '@core/_types/IShardClient';

export class AllShardsReadyEventHandler implements IEventHandler {
    public name = ShardClientEvents.AllShardsReady;
    public once = false;

    public async run(logger: ILoggerService, _shardClient: IShardClient) {
        logger.info(`Event '${this.name}' received: All shards are ready.`);
    }
}

module.exports = new AllShardsReadyEventHandler();
