import type { ILoggerService } from '@type/insights/ILoggerService';
import type { IShardClient } from '@type/IShardClient';
import type { CommandInteraction, AutocompleteInteraction, ComponentInteraction, PingInteraction } from 'eris';
import type { IInteractionHandler } from '@type/IInteractionHandler';
import type { ISlashCommand } from '@type/ISlashCommand';
import { readdirSync } from 'node:fs';
import path, { join } from 'node:path';

export class InteractionHandler implements IInteractionHandler {
    private _logger: ILoggerService;
    private _interactionsPath: string;
    private _slashCommands: ISlashCommand[] | undefined;

    constructor(logger: ILoggerService, interactionsPath: string) {
        this._logger = logger.updateContext({ module: 'interactions' }, false);
        this._interactionsPath = interactionsPath;
        this.loadInteractionHandlers();
    }

    public handleCommandInteraction(
        logger: ILoggerService,
        shardClient: IShardClient,
        interaction: CommandInteraction
    ): void {
        const shardId = shardClient.getShardId(interaction.guildID);
        const interactionLogger = logger.updateContext(
            { module: 'events', shardId: shardId, interactionId: interaction.id },
            false
        );

        interactionLogger.debug(
            `Received command interaction '${interaction.data.name}' with ID ${interaction.id} on shard ID ${shardId}`
        );

        for (const slashCommand of this._slashCommands || []) {
            if (interaction.data.name === slashCommand.commandName) {
                slashCommand.handleCommand(logger, shardClient, interaction);
            }
        }
    }

    public handleAutocompleteInteraction(
        _logger: ILoggerService,
        _shardClient: IShardClient,
        _interaction: AutocompleteInteraction
    ): void {
        // TODO: Implement autocomplete interaction handler
    }

    public handleComponentInteraction(
        _logger: ILoggerService,
        _shardClient: IShardClient,
        _interaction: ComponentInteraction
    ): void {
        // TODO: Implement component interaction handler
    }

    public handlePingInteraction(
        _logger: ILoggerService,
        _shardClient: IShardClient,
        _interaction: PingInteraction
    ): void {
        // TODO: Implement ping interaction handler
    }

    public loadInteractionHandlers(): void {
        const directoryContents: string[] = readdirSync(this._interactionsPath).filter((file) => !file.endsWith('.js'));
        if (!directoryContents || directoryContents.length === 0) {
            this._logger.error(`No interaction folders found in path: ${this._interactionsPath}`);
            throw new Error(`No interaction folders found in path ${this._interactionsPath}. Exiting...`); // move validation to corevalidator
        }

        for (const name of directoryContents) {
            switch (name) {
                case 'slashcommand':
                    this._logger.debug(`Loading slash command interaction handlers from '${name}' directory`);
                    this._loadSlashCommandInteractionHandlers(path.join(this._interactionsPath, name));
                    break;
                case 'autocomplete':
                    this._logger.debug(`Loading autocomplete interaction handlers from '${name}' directory`);
                    break;
                case 'component':
                    this._logger.debug(`Loading component interaction handlers from '${name}' directory`);
                    break;
                default:
                    // Unknown interaction type folder, ignore
                    break;
            }
        }
    }

    private _loadSlashCommandInteractionHandlers(folderPath: string): void {
        const slashCommands: ISlashCommand[] = [];
        const interactionFiles = this._getInteractionFileNames(folderPath);
        for (const file of interactionFiles) {
            const slashCommand: ISlashCommand = require(join(folderPath, file));
            if (!slashCommand.commandName || !slashCommand.handleCommand) {
                this._logger.error(`Slash command '${file}' does not implement ISlashCommand properly. Skipping...`);
                continue;
            }
            this._logger.error(`Slash command '${slashCommand.commandName}' loaded.`);

            slashCommands.push(slashCommand);
        }

        this._slashCommands = slashCommands;
    }

    private _getInteractionFileNames(folderPath: string): string[] {
        return readdirSync(folderPath).filter((file) => file.endsWith('.js'));
    }
}
