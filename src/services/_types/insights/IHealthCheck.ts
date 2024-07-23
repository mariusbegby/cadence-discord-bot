import type { ILoggerService } from '@type/insights/ILoggerService';

export enum HealthCheckStatus {
    HEALTHY = 'HEALTHY',
    UNHEALTHY = 'UNHEALTHY',
    UNKNOWN = 'UNKNOWN'
}

export type HealthCheckResult = {
    status: HealthCheckStatus;
    message: string;
};

export interface IHealthCheck {
    identifier: string;
    check(logger: ILoggerService): Promise<HealthCheckResult>;
    getStatus(): HealthCheckStatus;
}
