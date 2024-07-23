import { HealthCheckStatus, type IHealthCheck } from '@type/insights/IHealthCheck';
import type { IHealthCheckService } from '@type/insights/IHealthCheckService';
import type { ILoggerService } from '@type/insights/ILoggerService';

export class HealthCheckService implements IHealthCheckService {
    private _logger: ILoggerService;
    private _timer: NodeJS.Timeout | undefined;
    private _healthChecks: IHealthCheck[] = [];

    constructor(logger: ILoggerService) {
        logger.setContext({ module: 'services' });
        this._logger = logger;
    }

    public async start(interval: number = 60_000): Promise<void> {
        this._logger.debug('Starting health check service...');
        if (this._timer) {
            clearInterval(this._timer);
        }

        this._timer = setInterval(() => this.runHealthChecks(), interval);

        this._logger.info('Successfully started health check service.');
    }

    public async stop(): Promise<void> {
        this._logger.debug('Stopping health check service...');

        if (this._timer) {
            clearInterval(this._timer);
            this._timer = undefined;
        }

        this._logger.info('Successfully stopped health check service.');
    }

    public registerHealthCheck(healthCheck: IHealthCheck): void {
        this._logger.debug(`Registering health check with identifier '${healthCheck.identifier}'...`);
        this._healthChecks.push(healthCheck);
    }

    public getHealthChecks(): IHealthCheck[] {
        return this._healthChecks;
    }

    private async runHealthChecks(): Promise<void> {
        this._logger.info('Running health checks...');

        for (const healthCheck of this._healthChecks) {
            try {
                const result = await healthCheck.check(this._logger);
                switch (result.status) {
                    case HealthCheckStatus.HEALTHY:
                        this._logger.debug(`Health check '${healthCheck.identifier}' passed.`);
                        break;
                    case HealthCheckStatus.UNHEALTHY:
                        this._logger.error(`Health check '${healthCheck.identifier}' failed.`);
                        break;
                    case HealthCheckStatus.UNKNOWN:
                        this._logger.warn(`Health check '${healthCheck.identifier}' status is unknown.`);
                        break;
                    default:
                        this._logger.error(`Health check '${healthCheck.identifier}' returned an unknown status.`);
                        break;
                }
            } catch (error) {
                this._logger.error(error, `Health check '${healthCheck.identifier}' encountered an error.`);
            }
        }

        this._logger.info('Completed health checks.');
    }
}
