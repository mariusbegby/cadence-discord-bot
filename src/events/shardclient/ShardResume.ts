import { ShardEvents } from '@type/IEventHandler';
import type { IEventHandler } from '@type/IEventHandler';
import type { ILoggerService } from '@services/_types/insights/ILoggerService';
import type { IShardClient } from '@core/_types/IShardClient';

export class ShardResumeEventHandler implements IEventHandler {
    public name = ShardEvents.ShardResume;
    public once = false;

    public async run(logger: ILoggerService, _shardClient: IShardClient, shardId: number) {
        logger.info(`Event '${this.name}' received: Shard with ID ${shardId} has resumed.`);
    }
}

module.exports = new ShardResumeEventHandler();
