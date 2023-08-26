const config = require('config');
const embedOptions = config.get('embedOptions');
const botOptions = config.get('botOptions');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Show a list of commands and their usage.')
        .setDMPermission(false)
        .setNSFW(false),
    execute: async ({ interaction, client, executionId }) => {
        const logger = require('../../services/logger').child({
            source: 'help.js',
            module: 'slashCommand',
            name: '/help',
            executionId: executionId,
            shardId: interaction.guild.shardId,
            guildId: interaction.guild.id
        });

        const commandList = client.commands
            .filter((command) => {
                // don't include system commands
                if (command.isSystemCommand) {
                    return false;
                }
                return true;
            })
            .map((command) => {
                let params = command.data.options[0] ? `**\`${command.data.options[0].name}\`**` + ' ' : '';
                let beta = command.isBeta ? `${embedOptions.icons.beta} ` : '';
                let newCommand = command.isNew ? `${embedOptions.icons.new} ` : '';
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
