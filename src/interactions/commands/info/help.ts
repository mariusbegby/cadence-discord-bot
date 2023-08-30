import config from 'config';
import {
    EmbedBuilder,
    SharedSlashCommandOptions,
    SlashCommandBuilder,
    SlashCommandNumberOption,
    SlashCommandStringOption
} from 'discord.js';
import { Logger } from 'pino';
import loggerModule from '../../../services/logger';
import { BotOptions, EmbedOptions } from '../../../types/configTypes';
import { BaseSlashCommandInteraction } from '../../../types/interactionTypes';

const embedOptions: EmbedOptions = config.get('embedOptions');
const botOptions: BotOptions = config.get('botOptions');

const command: BaseSlashCommandInteraction = {
    isNew: false,
    isBeta: false,
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Show a list of commands and their usage.')
        .setDMPermission(false)
        .setNSFW(false),
    execute: async ({ interaction, client, executionId }) => {
        const logger: Logger = loggerModule.child({
            source: 'help.js',
            module: 'slashCommand',
            name: '/help',
            executionId: executionId,
            shardId: interaction.guild?.shardId,
            guildId: interaction.guild?.id
        });

        // TODO: Create interface for command list
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
                const beta: string = command.isBeta ? `${embedOptions.icons.beta} ` : '';
                const newCommand: string = command.isNew ? `${embedOptions.icons.new} ` : '';
                return `- **\`/${command.data.name}\`** ${params}- ${beta}${newCommand}${command.data.description}`;
            });

        const commandListString: string = commandList.join('\n');

        const supportServerString: string = botOptions.serverInviteUrl
            ? `${embedOptions.icons.support} **Support server**\nJoin the support server for help or to suggest improvements: \n**${botOptions.serverInviteUrl}**\n\n`
            : '';
        const addBotString: string = botOptions.botInviteUrl
            ? `${embedOptions.icons.bot} **Enjoying ${botOptions.name}?**\nAdd me to another server: \n**[Click me!](${botOptions.botInviteUrl})**`
            : '';

        logger.debug('Responding with info embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `${embedOptions.icons.rule} **List of commands**\n` +
                            `${commandListString}\n\n` +
                            supportServerString +
                            addBotString
                    )
                    .setColor(embedOptions.colors.info)
            ]
        });
    }
};

export default command;
