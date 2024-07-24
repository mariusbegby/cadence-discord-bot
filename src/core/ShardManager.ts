import type { ShardManagerConfig } from '@config/types';
import type { ILoggerService } from '@type/insights/ILoggerService';
import type { IShardManager } from '@type/IShardManager';

export class ShardManager implements IShardManager {
    private _logger: ILoggerService;
    private _shardManagerConfig: ShardManagerConfig;

    constructor(logger: ILoggerService, shardManagerConfig: ShardManagerConfig) {
        this._logger = logger;
        this._shardManagerConfig = shardManagerConfig;
    }

    async start() {
        this._logger.debug('Starting shard manager...');
        //throw new Error('Not implemented');

        this._logger.info('Successfully started shard manager.');
    }
}
