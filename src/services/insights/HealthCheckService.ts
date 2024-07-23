import type { IHealthCheck } from '@type/insights/IHealthCheck';
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
        this._logger.info('Starting health check service...');
        throw new Error('Not implemented');

        if (this._timer) {
            clearInterval(this._timer);
        }

        this._timer = setInterval(() => this.runHealthChecks(), interval);
    }

    public async stop(): Promise<void> {
        this._logger.info('Stopping health check service...');
        throw new Error('Not implemented');

        if (this._timer) {
            clearInterval(this._timer);
            this._timer = undefined;
        }
    }

    public registerHealthCheck(healthCheck: IHealthCheck): void {
        this._logger.info(healthCheck, 'Registering health check...');
        throw new Error('Not implemented');

        this._healthChecks.push(healthCheck);
    }

    private async runHealthChecks(): Promise<void> {
        this._logger.info('Running health checks...');
        throw new Error('Not implemented');

        for (const healthCheck of this._healthChecks) {
            try {
                const result = await healthCheck.check(this._logger);
                if (!result) {
                    this._logger.error(`Health check '${healthCheck.name}' failed.`);
                    // do someting like alertingService.alert(...)
                } else {
                    this._logger.info(`Health check '${healthCheck.name}' passed.`);
                }
            } catch (error) {
                this._logger.error(error, `Health check '${healthCheck.name}' encountered an error.`);
            }
        }
    }
}
