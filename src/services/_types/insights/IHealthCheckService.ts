import type { IHealthCheck } from '@type/insights/IHealthCheck';

export interface IHealthCheckService {
    start(interval: number): Promise<void>;
    stop(): Promise<void>;
    registerHealthCheck(healthCheck: IHealthCheck): void;
}
