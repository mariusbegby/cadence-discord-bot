import { ShardEvents } from '@type/IEventHandler';
import type { IEventHandler } from '@type/IEventHandler';
import type { ILoggerService } from '@services/_types/insights/ILoggerService';
import type { IShardClient } from '@core/_types/IShardClient';

export class ErrorEventHandler implements IEventHandler {
    public name = ShardEvents.Error;
    public once = false;

    public async run(logger: ILoggerService, _shardClient: IShardClient, message: string, shardId: number) {
        logger.error(message, `Event '${this.name}' received: Shard with ID ${shardId} received an error message.`);
    }
}

module.exports = new ErrorEventHandler();
