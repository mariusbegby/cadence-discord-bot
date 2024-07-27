import Eris, { Client, type CommandInteraction, type PingInteraction } from 'eris';
import type { ShardClientConfig } from '@config/types';
import type { ILoggerService } from '@type/insights/ILoggerService';
import type { IShardClient } from '@type/IShardClient';

export enum ShardClientEvents {
    AllShardsReady = 'ready', // no params - All shards are ready
    Disconnect = 'disconnect' // shardId - All shards disconnect
}

export enum ShardEvents {
    ShardReady = 'shardReady', // shardId
    ShardPreReady = 'shardPreReady', // shardId
    ShardDisconnect = 'shardDisconnect', // shardId
    ShardResume = 'shardResume', // shardId
    Connect = 'connect', // shardId - Fired when the shard establishes a connection
    GuildCreate = 'guildCreate', // guild
    GuildDelete = 'guildDelete', // guild
    InteractionCreate = 'interactionCreate', // interaction (PingInteraction, CommandInteraction, ComponentInteraction, AutocompleteInteraction, UnknownInteraction)
    Hello = 'hello', // trace, shardId
    Unknown = 'unknown', // packet, shardId
    Debug = 'debug', // message, shardId
    Warn = 'warn', // message, shardId
    Error = 'error' // message, shardId
}

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
        this._logger.debug(`Registering event listener for ${eventName}...`);
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

    private async _setupEventListeners() {
        // Shard client events

        this.registerEventListener(ShardClientEvents.AllShardsReady, false, () => {
            this._logger.info(`Logged in as ${this._shardClient.user.username}`);
        });

        this._shardClient.on(ShardClientEvents.Disconnect, (shardId) => {
            this._logger.info(`Shard with ID ${shardId} disconnected.`);
        });

        // Shard events
        this._shardClient.on(ShardEvents.ShardDisconnect, (shardId) => {
            this._logger.info(`Shard with ID ${shardId} disconnected.`);
        });

        this._shardClient.on(ShardEvents.ShardResume, (shardId) => {
            this._logger.info(`Shard with ID ${shardId} resumed.`);
        });

        this._shardClient.on(ShardEvents.Connect, (shardId) => {
            this._logger.info(`Shard with ID ${shardId} connected.`);
        });

        this._shardClient.on(ShardEvents.GuildCreate, (guild) => {
            this._logger.info(`Guild with ID ${guild.id} created.`);
        });

        this._shardClient.on(ShardEvents.GuildDelete, (guild) => {
            this._logger.info(`Guild with ID ${guild.id} deleted.`);
        });

        this._shardClient.on(ShardEvents.Hello, (trace, shardId) => {
            this._logger.info({ trace }, `Shard with ID ${shardId} received HELLO.`);
        });

        this._shardClient.on(ShardEvents.Unknown, (packet, shardId) => {
            this._logger.warn({ packet }, `Shard with ID ${shardId} received an unknown packet.`);
        });

        this._shardClient.on(ShardEvents.Debug, (message, shardId) => {
            this._logger.debug({ message }, `Shard with ID ${shardId} received a debug message.`);
        });

        this._shardClient.on(ShardEvents.Warn, (message, shardId) => {
            this._logger.warn({ message }, `Shard with ID ${shardId} received a warning message.`);
        });

        this._shardClient.on(ShardEvents.Error, (message, shardId) => {
            this._logger.error({ message }, `Shard with ID ${shardId} received an error message.`);
        });

        this._shardClient.on('interactionCreate', async (interaction) => {
            this._logger.debug(`Received an interaction: ${interaction.id}`);

            switch (interaction.constructor.name) {
                case 'CommandInteraction': {
                    // temporary - experimenting before making dynamic handler
                    const inter = interaction as CommandInteraction;
                    switch (inter.data.name) {
                        case 'help':
                            inter.createMessage('Help command invoked.');
                            break;
                        case 'status': {
                            const nodeProcessMemUsageInMb: number = Number.parseFloat(
                                (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)
                            );
                            const replyString = `**Node.js memory:** ${nodeProcessMemUsageInMb.toLocaleString('en-US')} MB`;
                            inter.createMessage(replyString);
                            break;
                        }
                        case 'shards': {
                            const shardCount = this._shardClient.shards.size;
                            const replyString = `**Shard count:** ${shardCount}`;
                            inter.createMessage(replyString);
                            break;
                        }
                        default:
                            inter.createMessage('Unknown command.');
                            break;
                    }
                    break;
                }
                case 'AutocompleteInteraction':
                    this._logger.debug('Autocomplete received.');
                    break;
                case 'ComponentInteraction':
                    this._logger.debug('Component received.');
                    break;
                case 'PingInteraction':
                    this._logger.debug('Ping received.');
                    (interaction as PingInteraction).pong();
                    break;
                default:
                    this._logger.warn(`Unknown interaction type: ${interaction.constructor.name}`);
                    break;
            }

            return;
        });
    }
}
