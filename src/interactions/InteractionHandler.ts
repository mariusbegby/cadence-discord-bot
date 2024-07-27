import type { ILoggerService } from '@type/insights/ILoggerService';
import type { IShardClient } from '@type/IShardClient';
import type { CommandInteraction, AutocompleteInteraction, ComponentInteraction, PingInteraction } from 'eris';
import { MessageResponseFlags, type IInteractionHandler } from '@type/IInteractionHandler';
import type { ISlashCommand } from '@type/ISlashCommand';
import { readdirSync } from 'node:fs';
import path, { join } from 'node:path';
import type { IMessageComponent } from '@type/IMessageComponent';
import type { IAutocompleteCommand } from '@type/IAutocompleteCommand';

export class InteractionHandler implements IInteractionHandler {
    private _logger: ILoggerService;
    private _interactionsPath: string;
    private _slashCommands = new Map<string, ISlashCommand>();
    private _autocompleteCommands = new Map<string, IAutocompleteCommand>();
    private _components = new Map<string, IMessageComponent>();

    constructor(logger: ILoggerService, interactionsPath: string) {
        this._logger = logger.updateContext({ module: 'interactions' }, false);
        this._interactionsPath = interactionsPath;
        this.loadInteractionHandlers();
    }

    public async handleCommandInteraction(
        logger: ILoggerService,
        shardClient: IShardClient,
        interaction: CommandInteraction
    ): Promise<void> {
        const interactionLogger = this._getInteractionLogger(logger, shardClient, interaction);
        interactionLogger.debug(`Received command interaction with name '${interaction.data.name}'.`);

        const slashCommand = this._slashCommands.get(interaction.data.name);
        if (!slashCommand) {
            interactionLogger.debug(`No command handler found for '${interaction.data.name}'`);
            await interaction.createMessage({
                content: 'No command handler found for this command.',
                flags: MessageResponseFlags.Ephemeral
            });
            return;
        }

        await slashCommand.run(logger, shardClient, interaction);
    }

    public async handleAutocompleteInteraction(
        logger: ILoggerService,
        shardClient: IShardClient,
        interaction: AutocompleteInteraction
    ): Promise<void> {
        const interactionLogger = this._getInteractionLogger(logger, shardClient, interaction);
        interactionLogger.debug(`Received autocomplete interaction with name '${interaction.data.name}'.`);

        const autocompleteCommand = this._autocompleteCommands.get(interaction.data.name);
        if (!autocompleteCommand) {
            interactionLogger.debug(`No autocomplete command handler found for '${interaction.data.name}'`);
            await interaction.result([
                {
                    name: `name: ${interaction.data.name}`,
                    value: `value: ${interaction.data.name}`
                }
            ]);
            return;
        }

        logger.debug(`Handling autocomplete interaction with name '${interaction.data.name}'.`);
        await autocompleteCommand.run(logger, shardClient, interaction);
    }

    public async handleComponentInteraction(
        logger: ILoggerService,
        shardClient: IShardClient,
        interaction: ComponentInteraction
    ): Promise<void> {
        const interactionLogger = this._getInteractionLogger(logger, shardClient, interaction);
        interactionLogger.debug(`Received component interaction with custom id '${interaction.data.custom_id}'.`);

        const component = this._components.get(interaction.data.custom_id);
        if (!component) {
            interactionLogger.debug(`No component handler found for '${interaction.data.custom_id}'`);
            await interaction.createMessage({
                content: 'No component handler found for this command.',
                flags: MessageResponseFlags.Ephemeral
            });
            return;
        }

        await component.run(logger, shardClient, interaction);
    }

    public async handlePingInteraction(
        _logger: ILoggerService,
        _shardClient: IShardClient,
        _interaction: PingInteraction
    ): Promise<void> {
        await _interaction.pong();
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
                    this._loadAutocompleteInteractionHandlers(path.join(this._interactionsPath, name));
                    break;
                case 'component':
                    this._logger.debug(`Loading component interaction handlers from '${name}' directory`);
                    this._loadComponentInteractionHandlers(path.join(this._interactionsPath, name));
                    break;
                default:
                    // Unknown interaction type folder, ignore
                    break;
            }
        }
    }

    private _loadSlashCommandInteractionHandlers(folderPath: string): void {
        const slashCommands: Map<string, ISlashCommand> = new Map<string, ISlashCommand>();
        const interactionFiles = this._getInteractionFileNames(folderPath);
        for (const file of interactionFiles) {
            const slashCommand: ISlashCommand = require(join(folderPath, file));
            if (!slashCommand.data.name || !slashCommand.run) {
                this._logger.error(`Slash command '${file}' does not implement ISlashCommand properly. Skipping...`);
                continue;
            }
            this._logger.debug(`Slash command '${slashCommand.data.name}' loaded.`);

            slashCommands.set(slashCommand.data.name, slashCommand);
        }

        this._slashCommands = slashCommands;
    }

    private _loadAutocompleteInteractionHandlers(folderPath: string): void {
        const autocompleteCommands: Map<string, IAutocompleteCommand> = new Map<string, IAutocompleteCommand>();
        const interactionFiles = this._getInteractionFileNames(folderPath);
        for (const file of interactionFiles) {
            const autocompleteCommand: IAutocompleteCommand = require(join(folderPath, file));
            if (!autocompleteCommand.name || !autocompleteCommand.run) {
                this._logger.error(
                    `Autocomplete command '${file}' does not implement IAutocompleteCommand properly. Skipping...`
                );
                continue;
            }
            this._logger.debug(`Autocomplete command '${autocompleteCommand.name}' loaded.`);

            autocompleteCommands.set(autocompleteCommand.name, autocompleteCommand);
        }

        this._autocompleteCommands = autocompleteCommands;
    }

    private _loadComponentInteractionHandlers(folderPath: string): void {
        const components: Map<string, IMessageComponent> = new Map<string, IMessageComponent>();
        const interactionFiles = this._getInteractionFileNames(folderPath);
        for (const file of interactionFiles) {
            const component: IMessageComponent = require(join(folderPath, file));
            if (!component.customId || !component.run) {
                this._logger.error(`Component '${file}' does not implement IMessageComponent properly. Skipping...`);
                continue;
            }
            this._logger.debug(`Component '${component.customId}' loaded.`);

            components.set(component.customId, component);
        }

        this._components = components;
    }

    private _getInteractionFileNames(folderPath: string): string[] {
        return readdirSync(folderPath).filter((file) => file.endsWith('.js'));
    }

    private _getInteractionLogger(
        logger: ILoggerService,
        shardClient: IShardClient,
        interaction: CommandInteraction | AutocompleteInteraction | ComponentInteraction
    ): ILoggerService {
        const shardId = shardClient.getShardId(interaction.guildID);
        return logger.updateContext({ module: 'events', shardId: shardId, interactionId: interaction.id }, false);
    }
}
