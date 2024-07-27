import type { ILoggerService } from '@type/insights/ILoggerService';
import type { IDeploymentDispatcher } from '@type/IDeploymentDispatcher';
import { readdirSync } from 'node:fs';
import type { ISlashCommand } from '@type/ISlashCommand';
import { join } from 'node:path';
import type { IShardClient } from '@type/IShardClient';

export class DeploymentDispatcher implements IDeploymentDispatcher {
    private _logger: ILoggerService;
    private _slashCommands: ISlashCommand[] = [];
    private _slashCommandsPath: string;
    private _shardClient: IShardClient;

    constructor(logger: ILoggerService, shardClient: IShardClient, interactionsPath: string) {
        this._logger = logger;
        this._shardClient = shardClient;
        this._slashCommandsPath = join(interactionsPath, 'slashcommand');
    }

    public async refreshSlashCommands(): Promise<void> {
        this._loadSlashCommands(this._slashCommandsPath);

        // prefix and suffix slash commands with quote marks
        const commandsString = this._slashCommands.map((command) => `'/${command.data.name}'`).join(', ');
        this._logger.info(`Deploying slash commands: ${commandsString}`);
        await this._deploySlashCommands();
    }

    private _loadSlashCommands(folderPath: string): void {
        const slashCommands: ISlashCommand[] = [];
        const slashCommandFiles = this._getSlashCommandFiles(folderPath);
        for (const file of slashCommandFiles) {
            const slashCommand: ISlashCommand = require(join(folderPath, file));
            if (!slashCommand.data.name || !slashCommand.data.description) {
                this._logger.error(`Slash command '${file}' is not valid. Skipping...`);
                continue;
            }
            slashCommands.push(slashCommand);
        }
        this._logger.debug(slashCommands, `Loaded ${slashCommands.length} slash commands for deployment.`);
        this._slashCommands = slashCommands;
    }

    private _getSlashCommandFiles(folderPath: string): string[] {
        return readdirSync(folderPath).filter((file) => file.endsWith('.js'));
    }

    private async _deploySlashCommands(): Promise<void> {
        await this._shardClient.deleteCommands();
        for (const slashCommand of this._slashCommands) {
            this._logger.debug(`Deploying slash command '${slashCommand.data.name}'...`);
            await this._shardClient.deployCommand(slashCommand);
        }
        const registeredCommands = await this._shardClient.getCommands();
        this._logger.debug(registeredCommands, 'Successfully deployed slash commands:');
    }
}
