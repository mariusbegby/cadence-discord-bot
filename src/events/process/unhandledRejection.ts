import { ProcessEvents, type IEventHandler } from '@type/IEventHandler';
import type { ILoggerService } from '@services/_types/insights/ILoggerService';
import type { IShardClient } from '@core/_types/IShardClient';

export class UnhandledRejectionEventHandler implements IEventHandler {
    public eventName = ProcessEvents.UnhandledRejection;
    public triggerOnce = false;

    // biome-ignore lint/suspicious/noExplicitAny: We do not known the type of the reason and promise
    public handleEvent(logger: ILoggerService, _shardClient: IShardClient, reason: Error | any, promise: Promise<any>) {
        logger.error({ reason, promise }, `Event '${this.eventName}' received: An unhandled rejection has occurred.`);
    }
}

module.exports = new UnhandledRejectionEventHandler();
