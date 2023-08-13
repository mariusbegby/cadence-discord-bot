const logger = require('../../services/logger');
const { embedOptions, botOptions } = require('../../config');
const { cannotSendMessageInChannel } = require('../../utils/validation/permissionValidator');
const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    isDebug: false,
    execute: async (interaction, { client }) => {
        const command = client.commands.get(interaction.commandName);
        if (!command) {
            logger.warn(
                `[Shard ${interaction.guild.shardId}] Interaction created but command '${interaction.commandName}' was not found.`
            );
            return;
        }

        if (interaction.isAutocomplete()) {
            logger.debug(`[Shard ${interaction.guild.shardId}] Autocomplete created.`);
            try {
                await command.autocomplete({ interaction, client });
            } catch (error) {
                if (
                    error.message === 'Unknown interaction' ||
                    error.message === 'Interaction has already been acknowledged.'
                ) {
                    logger.debug(
                        `[Shard ${interaction.guild.shardId}] Autocomplete failed to be responded to, unknown interaction or already acknowledged.`
                    );
                    return;
                } else {
                    logger.warn(error, `[Shard ${interaction.guild.shardId}] Autocomplete failed to execute.`);
                }
                return;
            }
        } else if (interaction.isChatInputCommand()) {
            logger.debug(`[Shard ${interaction.guild.shardId}] Interaction created.`);
            try {
                if (await cannotSendMessageInChannel(interaction)) {
                    return;
                }
                const inputTime = new Date();

                await interaction.deferReply();
                await command.execute({ interaction, client });

                const outputTime = new Date();
                const executionTime = outputTime - inputTime;

                if (executionTime > 20000) {
                    logger.warn(
                        `[Shard ${interaction.guild.shardId}] Guild ${interaction.guild.id}> Command '${interaction}' took ${executionTime} ms to execute.`
                    );
                } else {
                    logger.info(
                        `[Shard ${interaction.guild.shardId}] Guild ${interaction.guild.id}> Command '${interaction}' executed in ${executionTime} ms.`
                    );
                }
            } catch (error) {
                logger.warn(
                    error,
                    `[Shard ${interaction.guild.shardId}] Guild ${interaction.guild.id}> Command '${interaction}' throwed and error and might have failed to execute properly.`
                );

                if (!interaction.deferred || !interaction.replied) {
                    logger.warn(error, 'Interaction was not deferred or replied to, and an error was thrown.');
                    return;
                }

                if (interaction.replied) {
                    // If the interaction has already been replied to, most likely command executed successfully or error is already handled.
                    return;
                } else if (interaction.deferred) {
                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(
                                    `**${embedOptions.icons.error} Uh-oh... _Something_ went wrong!**\nThere was an unexpected error while trying to execute this command.\n\nYou can try to perform the command again.\n\n_If this problem persists, please submit a bug report in the **[support server](${botOptions.serverInviteUrl})**._`
                                )
                                .setColor(embedOptions.colors.error)
                        ]
                    });
                } else {
                    await interaction.reply({
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
        }
    }
};
