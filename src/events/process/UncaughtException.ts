import { ProcessEvents, type IEventHandler } from '@type/IEventHandler';
import type { ILoggerService } from '@services/_types/insights/ILoggerService';
import type { IShardClient } from '@core/_types/IShardClient';

export class UncaughtExceptionEventHandler implements IEventHandler {
    public eventName = ProcessEvents.UncaughtException;
    public triggerOnce = false;

    public async handleEvent(logger: ILoggerService, _shardClient: IShardClient, error: Error, origin: string) {
        logger.error(error, `Event '${this.eventName}' received: An uncaught exception occurred in ${origin}.`);
    }
}

module.exports = new UncaughtExceptionEventHandler();
