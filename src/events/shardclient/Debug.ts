import { ShardEvents } from '@type/IEventHandler';
import type { IEventHandler } from '@type/IEventHandler';
import type { ILoggerService } from '@services/_types/insights/ILoggerService';
import type { IShardClient } from '@core/_types/IShardClient';

export class DebugEventHandler implements IEventHandler {
    public name = ShardEvents.Debug;
    public once = false;

    public async run(_logger: ILoggerService, _shardClient: IShardClient, _message: string, _shardId: number) {
        //logger.debug(message, `Event '${this.eventName}' received: Shard with ID ${shardId} received a debug message.`);
        return;
    }
}

module.exports = new DebugEventHandler();
