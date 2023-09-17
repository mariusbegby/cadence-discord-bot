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
        const data = new SlashCommandBuilder()
            .setName('help')
            .setDescription('Menampilkan seluruh daftar perintah (commands) bot');
        super(data);
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, client, interaction } = params;
        const logger = this.getLogger(this.name, executionId, interaction);

        const [commandEmbedString] = await Promise.all([this.getCommandEmbedString(client!)]);

        logger.debug('Responding with info embed.');
        return await interaction.editReply({
            embeds: [new EmbedBuilder().setDescription(commandEmbedString).setColor(this.embedOptions.colors.info)]
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
        return `- **\`/${command.data.name}\`** ${commandParams}- ${command.data.description}`;
    }

    private getCommandParams(command: BaseSlashCommandInteraction): string {
        const option = command.data.options[0];
        if (option instanceof SlashCommandNumberOption || option instanceof SlashCommandStringOption) {
            return `**\`${option.name}\`** `;
        }
        return '';
    }
}

export default new HelpCommand();
