import { ILoggerService } from '@type/insights/ILoggerService';
import { IStorageClient } from '@type/storage/IStorageClient';

export class StorageClient implements IStorageClient {
    private _logger: ILoggerService;

    constructor(logger: ILoggerService) {
        this._logger = logger;
    }

    async ping(): Promise<boolean> {
        this._logger.debug('Pinging storage client...');
        throw new Error('Not implemented');

        // Connect to DB and execute query to check if it's healthy
        // Return true if successful, false otherwise
        return true;
    }
}
