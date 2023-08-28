import config from 'config';
import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    EmbedBuilder,
    Events,
    Interaction,
    InteractionType,
    MessageComponentInteraction
} from 'discord.js';
import { v4 as uuidv4 } from 'uuid';

import loggerModule from '../../services/logger';
import { Command, ExtendedClient } from '../../types/clientTypes';
import { BotOptions, EmbedOptions } from '../../types/configTypes';
import { cannotSendMessageInChannel } from '../../utils/validation/permissionValidator';

const embedOptions: EmbedOptions = config.get('embedOptions');
const botOptions: BotOptions = config.get('botOptions');
module.exports = {
    name: Events.InteractionCreate,
    isDebug: false,
    execute: async (interaction: Interaction, { client }: { client: ExtendedClient }) => {
        const executionId = uuidv4();
        const logger = loggerModule.child({
            source: 'interactionCreate.js',
            module: 'event',
            name: 'interactionCreate',
            executionId: executionId,
            shardId: interaction.guild?.shardId,
            guildId: interaction.guild?.id
        });

        let interactionString: string = '';
        const interactionType: InteractionType = interaction.type;

        const handleComponent = async (interaction: MessageComponentInteraction) => {
            await interaction.deferReply();
            const componentId = interaction.customId.split('_')[0];
            const trackId = interaction.customId.split('_')[1];
            const componentModule = await import(`../../interactions/components/${componentId}.js`);
            await componentModule.execute({ interaction, trackId, executionId });
        };

        const handleAutocomplete = async (interaction: AutocompleteInteraction) => {
            //const command = client.commands?.get(interaction.commandName) as Command;
            const autocompleteModule = await import(`../../interactions/autocomplete/${interaction.commandName}.js`);
            const { default: autocomplete } = autocompleteModule;
            await autocomplete.execute({ interaction, executionId });
        };

        const handleCommand = async (interaction: ChatInputCommandInteraction) => {
            const command = client.commands?.get(interaction.commandName) as Command;
            if (!command) {
                logger.warn(`Interaction created but command '${interaction.commandName}' was not found.`);
                return;
            }

            logger.debug(`Chat input command interaction created for '${interaction.commandName}'.`);
            //try {
            await interaction.deferReply();

            if (await cannotSendMessageInChannel({ interaction, executionId })) {
                return;
            }

            const inputTime: number = new Date().getTime();

            await command.execute({ interaction, client, executionId });

            /* doesnt work because need to find subfolder
                /* Update registerClientCommands to registerClientInteractions
                /* Add client.interactions with { commandInteractions, componentInteractions, autocompleteInteractions 
                const commandModule = await import(`../../interactions/commands/SUBFOLDER/${interaction.commandName}.js`);
                const { default: command } = commandModule;
                await command.execute({ interaction, client, executionId });
                */

            const outputTime: number = new Date().getTime();
            const executionTime: number = outputTime - inputTime;

            logger.info(`Command '${interaction}' executed in ${executionTime} ms.`);
            /*
            } catch (error) {
                if (error instanceof Error) {
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
                            logger.info(
                                'Interaction was not deferred or replied, sending new reply with Uh-oh message.'
                            );
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
                } else {
                    throw error;
                }
            }
            */
        };

        try {
            switch (interactionType) {
                case InteractionType.ApplicationCommand:
                    interactionString = 'ApplicationCommand';
                    handleCommand(interaction as ChatInputCommandInteraction);
                    break;

                case InteractionType.ApplicationCommandAutocomplete:
                    interactionString = 'ApplicationCommandAutocomplete';
                    handleAutocomplete(interaction as AutocompleteInteraction);
                    break;

                case InteractionType.MessageComponent:
                    interactionString = 'MessageComponent';
                    handleComponent(interaction as MessageComponentInteraction);
                    break;

                default:
                    interactionString = 'Unknown';
                    break;
            }

            logger.debug(`Interaction of type '${interactionString}' created.`);
        } catch (error) {
            logger.error(error, `Error handling interaction of type '${interactionString}'`);

            const errorReply = {
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${embedOptions.icons.error} Uh-oh... _Something_ went wrong!**\nThere was an unexpected error while trying to execute this command.\n\nYou can try to perform the command again.\n\n_If this problem persists, please submit a bug report in the **[support server](${botOptions.serverInviteUrl})**._`
                        )
                        .setColor(embedOptions.colors.error)
                        .setFooter({ text: `Execution ID: ${executionId}` })
                ]
            };

            const handleErrorWithReplyToUser = async (interaction: Interaction, error: Error) => {
                logger.error(error, `Error handling interaction of type '${interactionString}'`);
                if (interaction.channel) {
                    // Send message to user in channel where interaction was made
                    logger.debug(`Sending error reply to channel '${interaction.channel.id}'.`);
                    await interaction.channel.send(errorReply);
                } else {
                    // Send message to user in DMs
                    logger.debug(`Sending error reply to user '${interaction.user.id}'.`);
                    await interaction.user.send(errorReply);
                }
            };

            switch (true) {
                case interaction instanceof ChatInputCommandInteraction:
                    await handleErrorWithReplyToUser(interaction, error as Error);
                    break;
                case interaction instanceof AutocompleteInteraction:
                    await handleErrorWithReplyToUser(interaction, error as Error);
                    break;
                case interaction instanceof MessageComponentInteraction:
                    await handleErrorWithReplyToUser(interaction, error as Error);
                    break;
                default:
                    // Something else went wrong
                    logger.error(error, 'Unhandled error while handling unkown interaction.');
                    break;
            }
        }

        /*
        if (interaction.isAutocomplete()) {

            try {
                command?.autocomplete && (await command?.autocomplete({ interaction, executionId }));
            } catch (error) {
                if (error instanceof Error) {
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
                } else {
                    throw error;
                }
            }
        }
        */

        /*
        if (interaction.isChatInputCommand()) {
            const command = client.commands?.get(interaction.commandName) as Command;
            if (!command) {
                logger.warn(`Interaction created but command '${interaction.commandName}' was not found.`);
                return;
            }
            logger.debug(`Chat input command interaction created for '${interaction.commandName}'.`);
            try {
                await interaction.deferReply();

                if (await cannotSendMessageInChannel({ interaction, executionId })) {
                    return;
                }

                const inputTime: number = new Date().getTime();

                await command.execute({ interaction, client, executionId });

                const outputTime: number = new Date().getTime();
                const executionTime: number = outputTime - inputTime;

                logger.info(`Command '${interaction}' executed in ${executionTime} ms.`);
            } catch (error) {
                if (error instanceof Error) {
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
                            logger.info(
                                'Interaction was not deferred or replied, sending new reply with Uh-oh message.'
                            );
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
                } else {
                    throw error;
                }
            }
        }
        */
    }
};
