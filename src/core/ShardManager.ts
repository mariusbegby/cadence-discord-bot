import type { ShardManagerConfig } from '@config/types';
import type { IShardManager } from '@interfaces/IShardManager';
import type { ILoggerService } from '@interfaces/insights/ILoggerService';

export class ShardManager implements IShardManager {
    private _logger: ILoggerService;
    private _shardManagerConfig: ShardManagerConfig;

    constructor(logger: ILoggerService, shardManagerConfig: ShardManagerConfig) {
        this._logger = logger;
        this._shardManagerConfig = shardManagerConfig;
    }

    async start() {
        this._logger.info('Starting shard manager...');
        this._logger.info(this._shardManagerConfig, 'Found configuration');

        throw new Error('Not implemented');
    }
}
