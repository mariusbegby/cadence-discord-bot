import {
    Collection,
    EmbedBuilder,
    SlashCommandBuilder,
    SlashCommandNumberOption,
    SlashCommandStringOption
} from 'discord.js';
import { BaseSlashCommandInteraction } from '../../../classes/interactions';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../../types/interactionTypes';
import { ExtendedClient } from '../../../types/clientTypes';

class HelpCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = new SlashCommandBuilder().setName('help').setDescription('Show the list of bot commands.');
        super(data);
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, client, interaction } = params;
        const logger = this.getLogger(this.name, executionId, interaction);

        const [commandEmbedString, supportServerString, addBotString] = await Promise.all([
            this.getCommandEmbedString(client!),
            this.getSupportServerString(),
            this.getAddBotString()
        ]);

        logger.debug('Responding with info embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `${this.embedOptions.icons.rule} **List of commands**\n` +
                            commandEmbedString +
                            supportServerString +
                            addBotString
                    )
                    .setColor(this.embedOptions.colors.info)
            ]
        });
    }

    private getNonSystemCommands(client: ExtendedClient): Collection<string, BaseSlashCommandInteraction> {
        const clientSlashCommands = client.slashCommandInteractions;
        const nonSystemCommands = clientSlashCommands?.filter((command) => !command.isSystemCommand);

        if (!nonSystemCommands) {
            throw new Error('No non-system commands found.');
        }

        return nonSystemCommands;
    }

    private async getCommandEmbedString(client: ExtendedClient): Promise<string> {
        const commandCollection = this.getNonSystemCommands(client!);

        const commandStringList = commandCollection.map((command: BaseSlashCommandInteraction) => {
            return this.getCommandString(command);
        });

        const commandString = commandStringList.join('\n') + '\n';
        return commandString;
    }

    private getCommandString(command: BaseSlashCommandInteraction): string {
        const commandParams: string = this.getCommandParams(command);
        const beta: string = command.isBeta ? `${this.embedOptions.icons.beta} ` : '';
        const newCommand: string = command.isNew ? `${this.embedOptions.icons.new} ` : '';
        return `- **\`/${command.data.name}\`** ${commandParams}- ${beta}${newCommand}${command.data.description}`;
    }

    private getCommandParams(command: BaseSlashCommandInteraction): string {
        const option = command.data.options[0];
        if (option instanceof SlashCommandNumberOption || option instanceof SlashCommandStringOption) {
            return `**\`${option.name}\`** `;
        }
        return '';
    }

    private async getSupportServerString(): Promise<string> {
        if (!this.botOptions.serverInviteUrl) {
            return '';
        }

        const embedString = `
            ${this.embedOptions.icons.support} **Support server**
            Join the support server for help or to suggest improvements: 
            **${this.botOptions.serverInviteUrl}**
        `;

        return embedString;
    }

    private async getAddBotString(): Promise<string> {
        if (!this.botOptions.botInviteUrl) {
            return '';
        }

        const embedString = `
            ${this.embedOptions.icons.bot} **Enjoying ${this.botOptions.name}?**
            Add me to another server: 
            **[Click me!](${this.botOptions.botInviteUrl})**
        `;

        return embedString;
    }
}

export default new HelpCommand();
