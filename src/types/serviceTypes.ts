export type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace' | 'silent';

export type TargetOptions = {
    target: string;
    level: LogLevel;
    options: {
        destination?: string;
        mkdir?: boolean;
        sync?: boolean;
        minLength?: number;
        colorize?: boolean;
        batching?: boolean;
        interval?: number;
        host?: string;
        basicAuth?: {
            username: string;
            password: string;
        };
    };
};
