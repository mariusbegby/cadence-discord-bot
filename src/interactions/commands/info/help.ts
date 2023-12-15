import {
    Collection,
    EmbedBuilder,
    SlashCommandBuilder,
    SlashCommandNumberOption,
    SlashCommandStringOption
} from 'discord.js';
import { BaseSlashCommandInteraction } from '../../../classes/interactions';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../../types/interactionTypes';
import { localizeCommand, useServerTranslator } from '../../../common/localeUtil';
import { ExtendedClient } from '../../../types/clientTypes';
import { TFunction } from 'i18next';

class HelpCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = localizeCommand(new SlashCommandBuilder().setName('help'));
        super(data);
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, client, interaction } = params;
        const logger = this.getLogger(this.name, executionId, interaction);
        const translator = useServerTranslator(interaction);

        const [commandEmbedString, supportServerString, addBotString] = await Promise.all([
            this.getCommandEmbedString(client!),
            this.getSupportServerString(translator),
            this.getAddBotString(translator)
        ]);

        logger.debug('Responding with info embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        translator('commands.help.listTitle', {
                            icon: this.embedOptions.icons.rule
                        }) +
                            '\n' +
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

    private async getSupportServerString(translator: TFunction): Promise<string> {
        if (!this.botOptions.serverInviteUrl) {
            return '';
        }

        return translator('commands.help.supportServerCallout', {
            icon: this.embedOptions.icons.support,
            invite: this.botOptions.serverInviteUrl
        });
    }

    private async getAddBotString(translator: TFunction): Promise<string> {
        if (!this.botOptions.botInviteUrl) {
            return '';
        }

        return translator('commands.help.addBotCallout', {
            icon: this.embedOptions.icons.bot,
            botName: this.botOptions.name,
            invite: this.botOptions.botInviteUrl
        });
    }
}

export default new HelpCommand();
