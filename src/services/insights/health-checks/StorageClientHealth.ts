import { type HealthCheckResult, HealthCheckStatus, type IHealthCheck } from '@type/insights/IHealthCheck';
import type { ILoggerService } from '@type/insights/ILoggerService';
import type { IStorageClient } from '@type/storage/IStorageClient';

export class StorageClientHealth implements IHealthCheck {
    public name: string = 'DatabaseHealth';
    private _storageClient: IStorageClient;

    constructor(storageClient: IStorageClient) {
        this._storageClient = storageClient;
    }

    async check(logger: ILoggerService): Promise<HealthCheckResult> {
        try {
            logger.info('Checking storage client health...');
            if (await this._storageClient.ping()) {
                logger.info('Storage client is healthy');
                return {
                    status: HealthCheckStatus.UP,
                    message: 'Storage client is healthy'
                };
            }

            logger.warn('Storage client is unhealthy');
            return {
                status: HealthCheckStatus.DOWN,
                message: 'Storage client is unhealthy'
            };
        } catch (error: unknown) {
            logger.error(error, 'An error occurred while checking storage client health.');
            return {
                status: HealthCheckStatus.UNKNOWN,
                message: 'An error occurred while checking storage client health.'
            };
        }
    }
}
