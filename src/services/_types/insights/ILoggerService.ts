import type { Logger as PinoLogger } from 'pino';

export type LogContext = { module: string };
export interface ILoggerService {
    setContext(context: LogContext): ILoggerService;

    getLogger(): PinoLogger;

    debug(contextObject: unknown, message?: string): void;

    info(contextObject: unknown, message?: string): void;

    warn(contextObject: unknown, message?: string): void;

    error(contextObject: unknown, message?: string): void;
}
