import { HealthCheckStatus, type IHealthCheck } from '@type/insights/IHealthCheck';
import type { IHealthCheckService } from '@type/insights/IHealthCheckService';
import type { ILoggerService } from '@type/insights/ILoggerService';

export class HealthCheckService implements IHealthCheckService {
    private _logger: ILoggerService;
    private _timer: NodeJS.Timeout | undefined;
    private _healthChecks: IHealthCheck[] = [];

    constructor(logger: ILoggerService) {
        this._logger = logger.updateContext({ module: 'services' });
    }

    public start(interval = 60_000): void {
        this._logger.debug('Starting health check service...');
        if (this._timer) {
            clearInterval(this._timer);
        }

        this._timer = setInterval(async () => await this._runHealthChecks(), interval);

        this._logger.debug('Successfully started health check service.');
    }

    public stop(): void {
        this._logger.debug('Stopping health check service...');

        if (this._timer) {
            clearInterval(this._timer);
            this._timer = undefined;
        }

        this._logger.debug('Successfully stopped health check service.');
    }

    public registerHealthCheck(healthCheck: IHealthCheck): void {
        this._logger.debug(`Registering health check with identifier '${healthCheck.identifier}'...`);
        this._healthChecks.push(healthCheck);
    }

    public getHealthChecks(): IHealthCheck[] {
        return this._healthChecks;
    }

    private async _runHealthChecks(): Promise<void> {
        this._logger.debug('Running health checks...');

        for (const healthCheck of this._healthChecks) {
            try {
                const result = await healthCheck.check(this._logger);
                switch (result.status) {
                    case HealthCheckStatus.Healthy:
                        this._logger.debug(`Health check '${healthCheck.identifier}' passed.`);
                        break;
                    case HealthCheckStatus.Unhealthy:
                        this._logger.error(`Health check '${healthCheck.identifier}' failed.`);
                        break;
                    case HealthCheckStatus.Unknown:
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

        this._logger.debug('Completed health checks.');
    }
}
