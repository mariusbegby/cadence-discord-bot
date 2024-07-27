/* eslint-disable no-console */
import type { LoggerServiceConfig } from '@config/types';
import type { ILoggerService, LogContext } from '@type/insights/ILoggerService';
import config from 'config';
import {
    type DestinationStream,
    type LoggerOptions,
    type Logger as PinoLogger,
    type TransportTargetOptions,
    pino
} from 'pino';

let loggerService: ILoggerService;

function generateExecutionId(): string {
    // uuid v4 generator (temporary to avoid external dependency)
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export const useLogger = (context?: LogContext): ILoggerService => {
    if (!loggerService) {
        loggerService = new LoggerService(context ?? { module: 'core' });
    }

    return loggerService;
};

export class LoggerService implements ILoggerService {
    private _logger: PinoLogger;
    private _logConfig: LoggerServiceConfig;

    constructor(context: LogContext, parent?: ILoggerService) {
        this._logConfig = config.get<LoggerServiceConfig>('loggerServiceConfig');

        if (parent) {
            this._logger = parent.getLogger().child(context);
        } else {
            const pinoOptions: LoggerOptions = {
                level: this._logConfig.logLevel,
                timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
                base: {
                    environment: process.env.NODE_ENV || 'development',
                    executionId: generateExecutionId(),
                    ...context
                }
            };

            const transport: DestinationStream = pino.transport({ targets: this._generateTransportTargets() });

            this._logger = pino(pinoOptions, transport);
        }
    }

    public getLogger(): PinoLogger {
        return this._logger;
    }

    public updateContext(context: LogContext, generateUuid = true): ILoggerService {
        const appliedContext: LogContext = {
            ...context
        };

        if (generateUuid) {
            appliedContext.executionId = generateExecutionId();
        }

        return new LoggerService(appliedContext, this);
    }

    public debug(arg1: string | unknown, arg2?: string): void {
        if (typeof arg1 === 'string') {
            this._logger.debug(arg1);
        } else {
            this._logger.debug(arg1, arg2);
        }
    }

    public info(arg1: string | unknown, arg2?: string): void {
        if (typeof arg1 === 'string') {
            this._logger.info(arg1);
        } else {
            this._logger.info(arg1, arg2);
        }
    }

    public warn(arg1: string | unknown, arg2?: string): void {
        if (typeof arg1 === 'string') {
            this._logger.warn(arg1);
        } else {
            this._logger.warn(arg1, arg2);
        }
    }

    public error(arg1: string | unknown, arg2?: string): void {
        if (typeof arg1 === 'string') {
            this._logger.error(arg1);
        } else {
            this._logger.error(arg1, arg2);
        }
    }

    private _generateTransportTargets(): TransportTargetOptions[] {
        const targets: TransportTargetOptions[] = [];

        targets.push({
            target: 'pino/file',
            level: this._logConfig.logLevel,
            options: {
                destination: './logs/app-all.log',
                mkdir: true,
                sync: false
            }
        });

        let usePinoPrettyTransport = false;
        let usePinoLokiTransport = false;

        if (this._logConfig.prettyConsoleFormat) {
            try {
                require.resolve('pino-pretty');
                usePinoPrettyTransport = true;
            } catch (e) {
                console.error(e);
                console.log('pino-pretty not available. Falling back to default console logging.');
                console.log('install pino-pretty for better console logging: npm i pino-pretty');
            }
        }

        if (this._logConfig.pushLogsToLoki) {
            try {
                require.resolve('pino-loki');
                usePinoLokiTransport = true;
            } catch (e) {
                console.error(e);
                console.log('pino-loki not available. Sending logs to Grafana Loki will be skipped.');
            }
        }

        if (usePinoPrettyTransport) {
            targets.push({
                target: 'pino-pretty',
                level: this._logConfig.logLevel,
                options: {
                    colorize: true,
                    ignore: this._logConfig.prettyConsoleIgnoreFields.join(',') || ''
                }
            } as TransportTargetOptions);
        } else {
            targets.push({
                target: 'pino/file',
                level: this._logConfig.logLevel,
                options: {
                    colorize: true,
                    sync: false
                }
            });
        }

        if (usePinoLokiTransport && process.env.LOKI_AUTH_PASSWORD !== '' && process.env.LOKI_AUTH_USERNAME !== '') {
            console.log(`Sending logs to Loki at ${process.env.LOKI_HOST}`);
            targets.push({
                target: 'pino-loki',
                level: this._logConfig.logLevel,
                options: {
                    sync: false,
                    batching: false,
                    interval: 5,
                    host: process.env.LOKI_HOST || 'http://localhost:3100',
                    basicAuth: {
                        username: process.env.LOKI_AUTH_USERNAME || '',
                        password: process.env.LOKI_AUTH_PASSWORD || ''
                    }
                }
            });
        }

        return targets;
    }
}
