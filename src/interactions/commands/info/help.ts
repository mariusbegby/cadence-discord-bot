import { EmbedBuilder, SlashCommandBuilder, SlashCommandNumberOption, SlashCommandStringOption } from 'discord.js';
import {
    BaseSlashCommandInteraction,
    BaseSlashCommandParams,
    BaseSlashCommandReturnType
} from '../../../types/interactionTypes';

class HelpCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = new SlashCommandBuilder()
            .setName('help')
            .setDescription('Show the list of bot commands.');
        super(data);
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, client, interaction } = params;
        const logger = this.getLogger(this.name, executionId, interaction);

        const commandList = client!
            .commands!.filter((command: BaseSlashCommandInteraction) => {
                // don't include system commands
                if (command.isSystemCommand) {
                    return false;
                }
                return true;
            })
            .map((command: BaseSlashCommandInteraction) => {
                let params: string = '';
                const option = command.data.options[0];
                if (option instanceof SlashCommandNumberOption || option instanceof SlashCommandStringOption) {
                    params = `**\`${option.name}\`**` + ' ';
                }
                const beta: string = command.isBeta ? `${this.embedOptions.icons.beta} ` : '';
                const newCommand: string = command.isNew ? `${this.embedOptions.icons.new} ` : '';
                return `- **\`/${command.data.name}\`** ${params}- ${beta}${newCommand}${command.data.description}`;
            });

        const commandListString: string = commandList.join('\n');

        const supportServerString: string = this.botOptions.serverInviteUrl
            ? `${this.embedOptions.icons.support} **Support server**\n` +
              'Join the support server for help or to suggest improvements: \n' +
              `**${this.botOptions.serverInviteUrl}**\n\n`
            : '';
        const addBotString: string = this.botOptions.botInviteUrl
            ? `${this.embedOptions.icons.bot} **Enjoying ${this.botOptions.name}?**\n` +
              'Add me to another server: \n' +
              `**[Click me!](${this.botOptions.botInviteUrl})**`
            : '';

        logger.debug('Responding with info embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `${this.embedOptions.icons.rule} **List of commands**\n` +
                            `${commandListString}\n\n` +
                            supportServerString +
                            addBotString
                    )
                    .setColor(this.embedOptions.colors.info)
            ]
        });
    }
}

export default new HelpCommand();
