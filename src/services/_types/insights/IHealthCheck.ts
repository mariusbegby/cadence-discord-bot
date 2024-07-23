import type { ILoggerService } from '@type/insights/ILoggerService';

export enum HealthCheckStatus {
    UP = 'UP',
    DOWN = 'DOWN',
    UNKNOWN = 'UNKNOWN'
}

export type HealthCheckResult = {
    status: HealthCheckStatus;
    message: string;
};

export interface IHealthCheck {
    name: string;
    check(logger: ILoggerService): Promise<HealthCheckResult>;
    getStatus(): HealthCheckStatus;
}
