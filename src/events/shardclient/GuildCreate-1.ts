import { ShardEvents } from '@type/IEventHandler';
import type { IEventHandler } from '@type/IEventHandler';
import type { ILoggerService } from '@services/_types/insights/ILoggerService';
import type { IShardClient } from '@core/_types/IShardClient';
import type { Guild } from 'eris';

export class GuildCreateEventHandler implements IEventHandler {
    public eventName = ShardEvents.GuildCreate;
    public triggerOnce = false;

    public handleEvent(logger: ILoggerService, _shardClient: IShardClient, guild: Guild) {
        logger.info(`Event '${this.eventName}' received: Bot added to guild with ID ${guild.id}.`);
    }
}

module.exports = new GuildCreateEventHandler();
