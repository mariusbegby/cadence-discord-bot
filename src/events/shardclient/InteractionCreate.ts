import { ShardEvents } from '@type/IEventHandler';
import type { IEventHandler } from '@type/IEventHandler';
import type { ILoggerService } from '@services/_types/insights/ILoggerService';
import type { IShardClient } from '@core/_types/IShardClient';
import type {
    AutocompleteInteraction,
    CommandInteraction,
    ComponentInteraction,
    Interaction,
    PingInteraction
} from 'eris';
import { benchmark } from '@utilities/DevUtilities';

export class InteractionCreateEventHandler implements IEventHandler {
    public eventName = ShardEvents.InteractionCreate;
    public triggerOnce = false;

    public handleEvent(logger: ILoggerService, _shardClient: IShardClient, interaction: Interaction) {
        logger.debug(`Event '${this.eventName}' received: Interaction ID: ${interaction.id}`);

        switch (interaction.constructor.name) {
            case 'CommandInteraction':
                this._handleCommandInteraction(logger, _shardClient, interaction as CommandInteraction);
                break;
            case 'AutocompleteInteraction':
                this._handleAutocompleteInteraction(logger, interaction as AutocompleteInteraction);
                break;
            case 'ComponentInteraction':
                this._handleComponentInteraction(logger, interaction as ComponentInteraction);
                break;
            case 'PingInteraction':
                this._handlePingInteraction(logger, interaction as PingInteraction);
                break;
            default:
                logger.debug(`Received unknown interaction: ${interaction.id}`);
                break;
        }
    }

    private _handleCommandInteraction(
        logger: ILoggerService,
        _shardClient: IShardClient,
        interaction: CommandInteraction
    ): void {
        benchmark(logger, '_handleCommandInteraction', () => {
            const shardId = _shardClient.getShardId(interaction.guildID);
            const interactionLogger = logger.updateContext(
                { module: 'events', shardId: shardId, interactionId: interaction.id },
                false
            );

            interactionLogger.debug(
                `Received command interaction '${interaction.data.name}' with ID ${interaction.id}`
            );
            switch (interaction.data.name) {
                case 'help':
                    interaction.createMessage('Help command invoked.');
                    break;
                case 'status': {
                    const nodeProcessMemUsageInMb: number = Number.parseFloat(
                        (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)
                    );
                    const replyString = `**Node.js memory:** ${nodeProcessMemUsageInMb.toLocaleString('en-US')} MB`;
                    interaction.createMessage(replyString);
                    break;
                }
                case 'shards': {
                    const shardCount = _shardClient.getShardCount();
                    const replyString = `**Shard count:** ${shardCount}`;
                    interaction.createMessage(replyString);
                    break;
                }
                default:
                    interaction.createMessage('Unknown command.');
                    break;
            }

            interactionLogger.info(`Handled command interaction '${interaction.data.name}'.`);
        });
    }

    private _handleAutocompleteInteraction(logger: ILoggerService, interaction: AutocompleteInteraction): void {
        logger.debug(`Received autocomplete interaction '${interaction.data.name}' with ID ${interaction.id}`);
    }

    private _handleComponentInteraction(logger: ILoggerService, interaction: ComponentInteraction): void {
        logger.debug(`Received component interaction '${interaction.data.custom_id}' with ID ${interaction.id}`);
    }

    private _handlePingInteraction(logger: ILoggerService, interaction: PingInteraction): void {
        logger.debug(`Received ping interaction with ID ${interaction.id}`);
        interaction.pong();
    }
}

module.exports = new InteractionCreateEventHandler();
