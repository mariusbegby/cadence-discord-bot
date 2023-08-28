import config from 'config';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

import loggerModule from '../../../services/logger';
import { CustomSlashCommandInteraction } from '../../../types/interactionTypes';
import { BotOptions, EmbedOptions } from '../../../types/configTypes';

const embedOptions: EmbedOptions = config.get('embedOptions');
const botOptions: BotOptions = config.get('botOptions');

const command: CustomSlashCommandInteraction = {
    isNew: false,
    isBeta: false,
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Show a list of commands and their usage.')
        .setDMPermission(false)
        .setNSFW(false),
    execute: async ({ interaction, client, executionId }) => {
        const logger = loggerModule.child({
            source: 'help.js',
            module: 'slashCommand',
            name: '/help',
            executionId: executionId,
            shardId: interaction.guild?.shardId,
            guildId: interaction.guild?.id
        });

        if (!client || !client.commands) {
            logger.error('Client is undefined or does not have commands property.');
            return;
        }

        const commandList = client.commands
            .filter((command) => {
                // don't include system commands
                if (command.isSystemCommand) {
                    return false;
                }
                return true;
            })
            .map((command) => {
                const params = command.data.options[0] ? `**\`${command.data.options[0].name}\`**` + ' ' : '';
                const beta = command.isBeta ? `${embedOptions.icons.beta} ` : '';
                const newCommand = command.isNew ? `${embedOptions.icons.new} ` : '';
                return `- **\`/${command.data.name}\`** ${params}- ${beta}${newCommand}${command.data.description}`;
            });

        const commandListString = commandList.join('\n');

        const supportServerString = botOptions.serverInviteUrl
            ? `${embedOptions.icons.support} **Support server**\nJoin the support server for help or to suggest improvements: \n**${botOptions.serverInviteUrl}**\n\n`
            : '';
        const addBotString = botOptions.botInviteUrl
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
