import { ShardEvents } from '@type/IEventHandler';
import type { IEventHandler } from '@type/IEventHandler';
import type { ILoggerService } from '@services/_types/insights/ILoggerService';
import type { IShardClient } from '@core/_types/IShardClient';

export class HelloEventHandler implements IEventHandler {
    public eventName = ShardEvents.Hello;
    public triggerOnce = false;

    public async handleEvent(logger: ILoggerService, _shardClient: IShardClient, trace: string[], shardId: number) {
        logger.debug(trace, `Event '${this.eventName}' received: Shard with ID ${shardId} received an HELLO packet.`);
    }
}

module.exports = new HelloEventHandler();
