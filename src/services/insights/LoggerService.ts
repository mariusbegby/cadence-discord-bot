import type { ILoggerService, LogContext } from '@interfaces/insights/ILoggerService';
import { type Logger as PinoLogger, pino } from 'pino';

let loggerService: ILoggerService;

export const useLogger = (): ILoggerService => {
    if (!loggerService) {
        loggerService = new LoggerService();
    }

    return loggerService;
};

export class LoggerService implements ILoggerService {
    private _logger: PinoLogger;

    constructor() {
        this._logger = pino();
        throw new Error('Not implemented');
    }

    setContext(context: LogContext): void {
        this._logger = this._logger.child(context);
    }

    debug(arg1: string | unknown, arg2?: string): void {
        if (typeof arg1 === 'string') {
            this._logger.debug(arg1);
        } else {
            this._logger.debug(arg1, arg2);
        }
    }

    info(arg1: string | unknown, arg2?: string): void {
        if (typeof arg1 === 'string') {
            this._logger.info(arg1);
        } else {
            this._logger.info(arg1, arg2);
        }
    }

    error(arg1: string | unknown, arg2?: string): void {
        if (typeof arg1 === 'string') {
            this._logger.error(arg1);
        } else {
            this._logger.error(arg1, arg2);
        }
    }
}
