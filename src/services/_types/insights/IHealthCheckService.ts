import type { IHealthCheck } from '@type/insights/IHealthCheck';

export interface IHealthCheckService {
    start(interval: number): void;
    stop(): void;
    registerHealthCheck(healthCheck: IHealthCheck): void;
    getHealthChecks(): IHealthCheck[];
}
