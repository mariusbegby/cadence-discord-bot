const { embedOptions, botOptions } = require('../../config');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Show a list of commands and their usage.')
        .setDMPermission(false)
        .setNSFW(false),
    execute: async ({ interaction, client }) => {
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

        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `${embedOptions.icons.rule} **List of commands**\n` +
                            `${commandListString}\n\n` +
                            `${embedOptions.icons.support} **Support server**\nJoin the support server for help or to suggest improvements: \n**${botOptions.serverInviteUrl}**\n\n` +
                            `${embedOptions.icons.bot} **Enjoying ${botOptions.name}?**\nAdd me to another server: \n**[Click me!](${botOptions.botInviteUrl})**`
                    )
                    .setColor(embedOptions.colors.info)
            ]
        });
    }
};
