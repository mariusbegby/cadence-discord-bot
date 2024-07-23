import { type HealthCheckResult, HealthCheckStatus, type IHealthCheck } from '@type/insights/IHealthCheck';
import type { ILoggerService } from '@type/insights/ILoggerService';
import type { IStorageClient } from '@type/storage/IStorageClient';

export class StorageClientHealth implements IHealthCheck {
    public name: string = 'DatabaseHealth';
    private _lastStatus: HealthCheckStatus = HealthCheckStatus.UNKNOWN;
    private _storageClient: IStorageClient;

    constructor(storageClient: IStorageClient) {
        this._storageClient = storageClient;
    }

    async check(logger: ILoggerService): Promise<HealthCheckResult> {
        try {
            logger.info('Checking storage client health...');
            if (await this._storageClient.ping()) {
                logger.info('Storage client is healthy');
                this._lastStatus = HealthCheckStatus.UP;
                return {
                    status: this._lastStatus,
                    message: 'Storage client is healthy'
                };
            }

            logger.warn('Storage client is unhealthy');
            this._lastStatus = HealthCheckStatus.DOWN;
            return {
                status: this._lastStatus,
                message: 'Storage client is unhealthy'
            };
        } catch (error: unknown) {
            logger.error(error, 'An error occurred while checking storage client health.');
            this._lastStatus = HealthCheckStatus.UNKNOWN;
            return {
                status: this._lastStatus,
                message: 'An error occurred while checking storage client health.'
            };
        }
    }

    getStatus(): HealthCheckStatus {
        return this._lastStatus;
    }
}
