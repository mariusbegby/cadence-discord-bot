import Eris, { Client } from 'eris';
import type { ShardClientConfig } from '@config/types';
import type { ILoggerService } from '@type/insights/ILoggerService';
import type { IShardClient } from '@type/IShardClient';

export class ShardClient implements IShardClient {
    private _logger: ILoggerService;
    private _shardClientConfig: ShardClientConfig;
    private _shardClient: Client;

    constructor(logger: ILoggerService, shardClientConfig: ShardClientConfig) {
        this._logger = logger;
        this._shardClientConfig = shardClientConfig;

        const token = process.env.DISCORD_BOT_TOKEN || '';
        this._shardClient = new Client(token, {
            intents: this._shardClientConfig.intents,
            shardConcurrency: this._shardClientConfig.shardConcurrency ?? 'auto',
            firstShardID: this._shardClientConfig.firstShardID ?? 0,
            lastShardID: this._shardClientConfig.lastShardID ?? undefined,
            maxShards: this._shardClientConfig.maxShards ?? 'auto',
            getAllUsers: false
        });
    }

    public async start() {
        this._logger.debug('Starting shard client...');

        try {
            this._logger.info('CONNECTING TO DISCORD...');
            await this._shardClient.connect();
            this._logger.info('CONNECTED TO DISCORD!');
            this._shardClient.editStatus('online', [
                {
                    name: '/help 🎶',
                    type: Eris.Constants.ActivityTypes.LISTENING
                }
            ]);
        } catch (error: unknown) {
            this._logger.error(error, 'An error occurred while connecting to the Discord gateway.');
            this._logger.warn('Make sure the DISCORD_BOT_TOKEN environment variable is set and valid.');
        }

        this._logger.info('Successfully started shard client.');
    }

    public registerEventListener(eventName: string, once: boolean, listener: () => void): void {
        this._logger.debug(`Registering ShardClient event listener for '${eventName}' event...`);
        once ? this._shardClient.once(eventName, listener) : this._shardClient.on(eventName, listener);
    }

    public removeAllListeners(): void {
        this._logger.debug('Removing all event listeners...');
        this._shardClient.removeAllListeners();
    }

    public setMaxListeners(maxListeners: number): void {
        this._logger.debug(`Setting max listeners to ${maxListeners}...`);
        this._shardClient.setMaxListeners(maxListeners);
    }

    // Only count of shards that this client manages
    public getShardCount(): number {
        return this._shardClient.shards.size;
    }

    // Should be shard count not only for current shard client but all clusters (global)
    // If maxShards is 'auto' or undefined, then this will return the shard count for this shard client only as we assume there's no clustering
    public getTotalShardCount(): number {
        let totalShardCount = this._shardClientConfig.maxShards === 'auto' ? 0 : this._shardClientConfig.maxShards ?? 0;
        if (totalShardCount === 0) {
            totalShardCount = this._shardClient.shards.size;
        }

        return totalShardCount;
    }
}
