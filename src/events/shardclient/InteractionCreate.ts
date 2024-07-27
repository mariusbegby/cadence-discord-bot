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
import { InteractionHandler } from '@interactions/InteractionHandler';
import type { IInteractionHandler } from '@type/IInteractionHandler';
import { join } from 'node:path';
import { useLogger } from '@services/insights/LoggerService';

export class InteractionCreateEventHandler implements IEventHandler {
    public eventName = ShardEvents.InteractionCreate;
    public triggerOnce = false;
    private _interactionHandler: IInteractionHandler = new InteractionHandler(
        useLogger(),
        join(__dirname, '..', '..', 'interactions')
    );

    public async handleEvent(logger: ILoggerService, shardClient: IShardClient, interaction: Interaction) {
        logger.debug(`Event '${this.eventName}' received: Interaction ID: ${interaction.id}`);

        switch (interaction.constructor.name) {
            case 'CommandInteraction':
                await this._interactionHandler.handleCommandInteraction(
                    logger,
                    shardClient,
                    interaction as CommandInteraction
                );
                break;
            case 'AutocompleteInteraction':
                await this._interactionHandler.handleAutocompleteInteraction(
                    logger,
                    shardClient,
                    interaction as AutocompleteInteraction
                );
                break;
            case 'ComponentInteraction':
                await this._interactionHandler.handleComponentInteraction(
                    logger,
                    shardClient,
                    interaction as ComponentInteraction
                );
                break;
            case 'PingInteraction':
                await this._handlePingInteraction(logger, interaction as PingInteraction);
                break;
            default:
                logger.debug(`Received unknown interaction with ID: ${interaction.id}`);
                break;
        }

        logger.debug(`Handled interaction with ID: ${interaction.id}`);
    }

    private async _handlePingInteraction(logger: ILoggerService, interaction: PingInteraction): Promise<void> {
        logger.debug(`Acknowledging ping interaction with ID ${interaction.id}`);
        await interaction.pong();
    }
}

module.exports = new InteractionCreateEventHandler();
