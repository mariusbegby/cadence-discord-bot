const path = require('node:path');
const logger = require(path.resolve('./src/services/logger.js'));
const { Events, EmbedBuilder } = require('discord.js');
const { embedColors, embedIcons, botInfo } = require(path.resolve('./config.json'));

module.exports = {
    name: Events.InteractionCreate,
    isDebug: false,
    execute: async (interaction, { client }) => {
        if (!interaction.isCommand()) {
            return;
        }

        const command = client.commands.get(interaction.commandName);
        if (!command) {
            logger.warn(`Interaction created but command '${interaction.commandName}' was not found.`);
            return;
        }

        try {
            const inputTime = new Date();

            await interaction.deferReply();
            await command.execute({ interaction, client });

            const outputTime = new Date();
            const executionTime = outputTime - inputTime;

            if (executionTime > 20000) {
                // don't send warning message for commands with collector timeouts, as collector timeout happens after 60 seconds
                if (
                    (interaction.commandName === 'filters' || interaction.commandName === 'nowplaying') &&
                    executionTime > 55000
                ) {
                    logger.info(
                        `(${interaction.guild.memberCount}) ${interaction.guild.name}> Command '${interaction}' executed in ${executionTime} ms.`
                    );
                    return;
                }

                logger.warn(
                    `(${interaction.guild.memberCount}) ${interaction.guild.name}> Command '${interaction}' took ${executionTime} ms to execute.`
                );

                return await interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(
                                `**${embedIcons.warning} Warning**\nThis command took ${
                                    executionTime / 1000
                                } seconds to execute.\n\n_If you experienced problems with the command, please try again._`
                            )
                            .setColor(embedColors.colorWarning)
                    ]
                });
            } else {
                logger.info(
                    `(${interaction.guild.memberCount}) ${interaction.guild.name}> Command '${interaction}' executed in ${executionTime} ms.`
                );
            }
        } catch (error) {
            logger.error(
                error,
                `(${interaction.guild.memberCount}) ${interaction.guild.name}> Command '${interaction}' failed to execute.`
            );

            await interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${embedIcons.error} Uh-oh... _Something_ went wrong!**\nThere was an unexpected error while trying to execute this command.\n\nYou can try to perform the command again.\n\n_If this problem persists, please submit a bug report in the **[support server](${botInfo.supportServerInviteUrl})**._`
                        )
                        .setColor(embedColors.colorError)
                ]
            });
        }
    }
};
