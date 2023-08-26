import config from 'config';
import { EmbedOptions } from '../../types/configTypes';
const embedOptions: EmbedOptions = config.get('embedOptions');
const botOptions = config.get('botOptions');
import { cannotSendMessageInChannel } from '../../utils/validation/permissionValidator';
import { Events, EmbedBuilder } from 'discord.js';
import { v4 as uuidv4 } from 'uuid';
import loggerModule from '../../services/logger';

module.exports = {
    name: Events.InteractionCreate,
    isDebug: false,
    execute: async (interaction, { client }) => {
        const executionId = uuidv4();
        const logger = loggerModule.child({
            source: 'interactionCreate.js',
            module: 'event',
            name: 'interactionCreate',
            executionId: executionId,
            shardId: interaction.guild.shardId,
            guildId: interaction.guild.id
        });

        if (interaction.isMessageComponent()) {
            logger.debug(
                `Message component interaction created for id ${interaction.customId}${
                    interaction.values ? ' and values ' + interaction.values : ''
                }.`
            );
            return;
        }

        const command = client.commands.get(interaction.commandName);
        if (!command) {
            logger.warn(`Interaction created but command '${interaction.commandName}' was not found.`);
            return;
        }

        if (interaction.isAutocomplete()) {
            logger.debug('Autocomplete interaction created.');
            try {
                await command.autocomplete({ interaction, executionId });
            } catch (error) {
                if (
                    error.message === 'Unknown interaction' ||
                    error.message === 'Interaction has already been acknowledged.'
                ) {
                    logger.debug(
                        'Autocomplete failed to be responded to, unknown interaction or already acknowledged.'
                    );
                    return;
                } else {
                    logger.warn(error, 'Autocomplete failed to execute.');
                }
                return;
            }
        } else if (interaction.isChatInputCommand()) {
            logger.debug(`Chat input command interaction created for '${interaction.commandName}'.`);
            try {
                await interaction.deferReply();

                if (await cannotSendMessageInChannel({ interaction, executionId })) {
                    return;
                }

                const inputTime = new Date();

                await command.execute({ interaction, client, executionId });

                const outputTime = new Date();
                const executionTime = outputTime - inputTime;

                logger.info(`Command '${interaction}' executed in ${executionTime} ms.`);
            } catch (error) {
                logger.warn(
                    error,
                    `Command '${interaction}' throwed an unhandled error and might have failed to execute properly.`
                );

                if (
                    error.message === 'Unknown interaction' ||
                    error.message === 'Interaction has already been acknowledged.'
                ) {
                    logger.debug('Command failed to be responded to, unknown interaction or already acknowledged.');
                    return;
                } else {
                    if (!interaction.deferred || !interaction.replied) {
                        logger.warn('Interaction was not deferred or replied to, and an error was thrown.');
                        return;
                    }

                    if (interaction.replied) {
                        // If the interaction has already been replied to, most likely command executed successfully or error is already handled.
                        return;
                    } else if (interaction.deferred) {
                        logger.info('Interaction was deferred, editing reply and sending Uh-oh message.');
                        await interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setDescription(
                                        `**${embedOptions.icons.error} Uh-oh... _Something_ went wrong!**\nThere was an unexpected error while trying to execute this command.\n\nYou can try to perform the command again.\n\n_If this problem persists, please submit a bug report in the **[support server](${botOptions.serverInviteUrl})**._`
                                    )
                                    .setColor(embedOptions.colors.error)
                                    .setFooter({ text: `Execution ID: ${executionId}` })
                            ]
                        });
                    } else {
                        logger.info('Interaction was not deferred or replied, sending new reply with Uh-oh message.');
                        await interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setDescription(
                                        `**${embedOptions.icons.error} Uh-oh... _Something_ went wrong!**\nThere was an unexpected error while trying to execute this command.\n\nYou can try to perform the command again.\n\n_If this problem persists, please submit a bug report in the **[support server](${botOptions.serverInviteUrl})**._`
                                    )
                                    .setColor(embedOptions.colors.error)
                                    .setFooter({ text: `Execution ID: ${executionId}` })
                            ]
                        });
                    }
                }
            }
        } else {
            logger.warn(interaction, 'Interaction created but was not a chat input or autocomplete interaction.');
        }
    }
};
