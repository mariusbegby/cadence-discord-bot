export type TargetOptions = {
    target: string;
    level: string;
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
