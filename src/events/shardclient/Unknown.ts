import { ShardEvents } from '@type/IEventHandler';
import type { IEventHandler } from '@type/IEventHandler';
import type { ILoggerService } from '@services/_types/insights/ILoggerService';
import type { IShardClient } from '@core/_types/IShardClient';

export class UnknownEventHandler implements IEventHandler {
    public eventName = ShardEvents.Unknown;
    public triggerOnce = false;

    public async handleEvent(logger: ILoggerService, _shardClient: IShardClient, packet: unknown, shardId: number) {
        logger.debug(
            packet,
            `Event '${this.eventName}' received: Shard with ID ${shardId} received an unknown packet.`
        );
    }
}

module.exports = new UnknownEventHandler();
