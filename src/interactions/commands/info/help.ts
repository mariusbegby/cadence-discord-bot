import {
    APIActionRowComponent,
    APIButtonComponent,
    APIMessageActionRowComponent,
    ButtonBuilder,
    ButtonStyle,
    Collection,
    ComponentType,
    EmbedBuilder,
    SlashCommandBuilder,
    SlashCommandNumberOption,
    SlashCommandStringOption
} from 'discord.js';
import { BaseSlashCommandInteraction } from '../../../classes/interactions';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../../types/interactionTypes';
import { localizeCommand, useServerTranslator } from '../../../common/localeUtil';
import { ExtendedClient } from '../../../types/clientTypes';

class HelpCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = localizeCommand(new SlashCommandBuilder().setName('help'));
        super(data);
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, client, interaction } = params;
        const logger = this.getLogger(this.name, executionId, interaction);
        const translator = useServerTranslator(interaction);

        const commandEmbedString = await this.getCommandEmbedString(client!);

        const components: APIMessageActionRowComponent[] = [];

        if (this.botOptions.serverInviteUrl && this.botOptions.serverInviteUrl !== '') {
            const supportServerButton: APIButtonComponent = new ButtonBuilder()
                .setURL(this.botOptions.serverInviteUrl)
                .setStyle(ButtonStyle.Link)
                .setEmoji(this.embedOptions.icons.support)
                .setLabel(translator('commands.help.supportServerButton'))
                .toJSON();
            components.push(supportServerButton);
        }

        if (this.botOptions.botInviteUrl && this.botOptions.botInviteUrl !== '') {
            const addBotButton: APIButtonComponent = new ButtonBuilder()
                .setURL(this.botOptions.botInviteUrl)
                .setStyle(ButtonStyle.Link)
                .setEmoji(this.embedOptions.icons.bot)
                .setLabel(translator('commands.help.addBotButton'))
                .toJSON();
            components.push(addBotButton);
        }

        const embedActionRow: APIActionRowComponent<APIMessageActionRowComponent> = {
            type: ComponentType.ActionRow,
            components
        };

        logger.debug('Responding with info embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        translator('commands.help.listTitle', {
                            icon: this.embedOptions.icons.rule
                        }) +
                            '\n' +
                            commandEmbedString
                    )
                    .setColor(this.embedOptions.colors.info)
            ],
            components: components.length > 0 ? [embedActionRow] : []
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

        const commandString = commandStringList.join('\n');
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
}

export default new HelpCommand();
