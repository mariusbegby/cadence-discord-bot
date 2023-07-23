const logger = require('../../services/logger');
const { embedOptions, botOptions } = require('../../config');
const { cannotSendMessageInChannel } = require('../../utils/validation/permissionValidator');
const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    isDebug: false,
    execute: async (interaction, { client }) => {
        if (!interaction.isCommand()) {
            return;
        }

        if (await cannotSendMessageInChannel(interaction)) {
            return;
        }

        const command = client.commands.get(interaction.commandName);
        if (!command) {
            logger.warn(
                `[Shard ${interaction.guild.shardId}] Interaction created but command '${interaction.commandName}' was not found.`
            );
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
                        `[Shard ${interaction.guild.shardId}] Guild ${interaction.guild.id}> Command '${interaction}' executed in ${executionTime} ms.`
                    );
                    return;
                }

                logger.warn(
                    `[Shard ${interaction.guild.shardId}] Guild ${interaction.guild.id}> Command '${interaction}' took ${executionTime} ms to execute.`
                );

                return await interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(
                                `**${embedOptions.icons.warning} Warning**\nThis command took ${
                                    executionTime / 1000
                                } seconds to execute.\n\n_If you experienced problems with the command, please try again._`
                            )
                            .setColor(embedOptions.colors.warning)
                    ]
                });
            } else {
                logger.info(
                    `[Shard ${interaction.guild.shardId}] Guild ${interaction.guild.id}> Command '${interaction}' executed in ${executionTime} ms.`
                );
            }
        } catch (error) {
            logger.error(
                error,
                `[Shard ${interaction.guild.shardId}] Guild ${interaction.guild.id}> Command '${interaction}' failed to execute.`
            );

            await interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${embedOptions.icons.error} Uh-oh... _Something_ went wrong!**\nThere was an unexpected error while trying to execute this command.\n\nYou can try to perform the command again.\n\n_If this problem persists, please submit a bug report in the **[support server](${botOptions.serverInviteUrl})**._`
                        )
                        .setColor(embedOptions.colors.error)
                ]
            });
        }
    }
};
