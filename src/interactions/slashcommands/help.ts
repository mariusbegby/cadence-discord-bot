import {
    type APIActionRowComponent,
    type APIButtonComponent,
    type APIMessageActionRowComponent,
    ButtonBuilder,
    ButtonStyle,
    type ChatInputCommandInteraction,
    type Collection,
    ComponentType,
    type LocaleString,
    EmbedBuilder,
    SlashCommandBuilder,
    SlashCommandNumberOption,
    SlashCommandStringOption,
    type APIButtonComponentWithCustomId
} from 'discord.js';
import { BaseSlashCommandInteraction } from '../../common/classes/interactions';
import type { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../types/interactionTypes';
import {
    type CommandMetadata,
    localizeCommand,
    translatorInstance,
    useServerTranslator
} from '../../common/utils/localeUtil';
import type { ExtendedClient } from '../../types/clientTypes';

class HelpCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = localizeCommand(new SlashCommandBuilder().setName('help'));
        super(data);
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, client, interaction } = params;
        const logger = this.getLogger(this.name, executionId, interaction);
        const translator = useServerTranslator(interaction);

        const commandEmbedString = await this.getCommandEmbedString(client!, interaction);

        const components: APIMessageActionRowComponent[] = [];

        if (this.botOptions.botInviteUrl && this.botOptions.botInviteUrl !== '') {
            const addBotButton: APIButtonComponent = new ButtonBuilder()
                .setURL(this.botOptions.botInviteUrl)
                .setStyle(ButtonStyle.Link)
                .setEmoji(this.embedOptions.icons.bot)
                .setLabel(translator('commands.help.addBotButton'))
                .toJSON() as APIButtonComponentWithCustomId;
            components.push(addBotButton);
        }

        const embedActionRow: APIActionRowComponent<APIMessageActionRowComponent> = {
            type: ComponentType.ActionRow,
            components
        };

        logger.debug('Responding with info embed.');
        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `${translator('commands.help.listTitle', {
                            icon: this.embedOptions.icons.rule
                        })}\n${commandEmbedString}`
                    )
                    .setColor(this.embedOptions.colors.info)
            ],
            components: components.length > 0 ? [embedActionRow] : []
        });
    }

    private getNonSystemCommands(client: ExtendedClient): Collection<string, BaseSlashCommandInteraction> {
        if (!client.slashCommandInteractions) {
            throw new Error('No commands found.');
        }

        return client.slashCommandInteractions;
    }

    private async getCommandEmbedString(
        client: ExtendedClient,
        interaction: ChatInputCommandInteraction
    ): Promise<string> {
        const commandCollection = this.getNonSystemCommands(client!);

        const locale = interaction.guildLocale ?? 'en-US';
        const commandStringList = commandCollection.map((command: BaseSlashCommandInteraction) => {
            return this.getCommandString(command, locale);
        });

        const commandString = commandStringList.join('\n');
        return commandString;
    }

    private getCommandString(command: BaseSlashCommandInteraction, locale: LocaleString): string {
        const commandName = command.data.name;
        const metadataKey = `commands.${commandName}.metadata`;
        const translatedData = translatorInstance.getResource(locale, 'bot', metadataKey) as
            | CommandMetadata
            | undefined;

        const commandParams: string = this.getCommandParams(command, locale);

        const beta: string = command.isBeta ? `${this.embedOptions.icons.beta} ` : '';
        const newCommand: string = command.isNew ? `${this.embedOptions.icons.new} ` : '';

        return `- **\`/${translatedData?.name ?? command.data.name}\`** ${commandParams}- ${beta}${newCommand}${
            translatedData?.description ?? command.data.description
        }`;
    }

    public getCommandParams(command: BaseSlashCommandInteraction, locale: LocaleString): string {
        const commandName = command.data.name;
        const option = command.data.options[0];

        if (option instanceof SlashCommandNumberOption || option instanceof SlashCommandStringOption) {
            const metadataKey = `commands.${commandName}.metadata.options.${option.name}`;
            const translatedData = translatorInstance.getResource(locale, 'bot', metadataKey) as
                | CommandMetadata
                | undefined;
            return `**\`${translatedData?.name ?? option.name}\`** `;
        }

        return '';
    }
}

export default new HelpCommand();
