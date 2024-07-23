export type LogContext = { module: string };
export interface ILoggerService {
    setContext(context: LogContext): void;

    debug(contextObject: unknown, message?: string): void;

    info(contextObject: unknown, message?: string): void;

    error(contextObject: unknown, message?: string): void;
}
