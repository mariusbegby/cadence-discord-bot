import type { Logger as PinoLogger } from 'pino';

export type LogContext = {
    module: string;
    executionId?: string;
    shardId?: number;
    interactionId?: string;
    guildId?: string;
};
export interface ILoggerService {
    updateContext(context: LogContext, newExecutionId?: boolean): ILoggerService;

    getLogger(): PinoLogger;

    debug(contextObject: unknown, message?: string): void;

    info(contextObject: unknown, message?: string): void;

    warn(contextObject: unknown, message?: string): void;

    error(contextObject: unknown, message?: string): void;
}
