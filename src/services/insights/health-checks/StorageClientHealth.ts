import { type HealthCheckResult, HealthCheckStatus, type IHealthCheck } from '@type/insights/IHealthCheck';
import type { ILoggerService } from '@type/insights/ILoggerService';
import type { IStorageClient } from '@type/storage/IStorageClient';

export class StorageClientHealth implements IHealthCheck {
    public identifier = 'StorageClientHealth';
    private _lastStatus: HealthCheckStatus = HealthCheckStatus.Unknown;
    private _storageClient: IStorageClient;

    constructor(storageClient: IStorageClient) {
        this._storageClient = storageClient;
    }

    async check(logger: ILoggerService): Promise<HealthCheckResult> {
        try {
            logger.info('Checking storage client health...');
            if (await this._storageClient.ping()) {
                logger.info('Storage client is healthy');
                this._lastStatus = HealthCheckStatus.Healthy;
                return {
                    status: this._lastStatus,
                    message: 'Storage client is healthy'
                };
            }

            logger.warn('Storage client is unhealthy');
            this._lastStatus = HealthCheckStatus.Unhealthy;
            return {
                status: this._lastStatus,
                message: 'Storage client is unhealthy'
            };
        } catch (error: unknown) {
            logger.warn(error, 'An error occurred while checking storage client health.');
            this._lastStatus = HealthCheckStatus.Unknown;
            return {
                status: this._lastStatus,
                message: 'An error occurred while checking storage client health.'
            };
        }
    }

    public getStatus(): HealthCheckStatus {
        return this._lastStatus;
    }
}
