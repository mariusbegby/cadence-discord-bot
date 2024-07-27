import { ShardEvents } from '@type/IEventHandler';
import type { IEventHandler } from '@type/IEventHandler';
import type { ILoggerService } from '@services/_types/insights/ILoggerService';
import type { IShardClient } from '@core/_types/IShardClient';

export class ConnectEventHandler implements IEventHandler {
    public name = ShardEvents.Connect;
    public once = false;

    public async run(logger: ILoggerService, _shardClient: IShardClient, shardId: number) {
        logger.debug(`Event '${this.name}' received: Shard with ID ${shardId} has established a connection.`);
    }
}

module.exports = new ConnectEventHandler();
