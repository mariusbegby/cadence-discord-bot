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
import { CustomError } from '../../types/interactionTypes';

const embedOptions: EmbedOptions = config.get('embedOptions');
const botOptions: BotOptions = config.get('botOptions');
module.exports = {
    name: Events.InteractionCreate,
    isDebug: false,
    execute: async (interaction: Interaction, { client }: { client: ExtendedClient }) => {
        const inputTime: number = new Date().getTime();
        const executionId = uuidv4();
        const logger = loggerModule.child({
            source: 'interactionCreate.js',
            module: 'event',
            name: 'interactionCreate',
            executionId: executionId,
            shardId: interaction.guild?.shardId,
            guildId: interaction.guild?.id
        });

        logger.debug('Interaction received.');

        let interactionIdentifier = 'Unknown';

        if (
            interaction.type === InteractionType.ApplicationCommand ||
            interaction.type === InteractionType.ApplicationCommandAutocomplete
        ) {
            interactionIdentifier = (interaction as ChatInputCommandInteraction).commandName;
        } else if (interaction.type === InteractionType.MessageComponent) {
            interactionIdentifier = (interaction as MessageComponentInteraction).customId;
        }

        // Todo: Extract to own file
        const handleComponent = async (interaction: MessageComponentInteraction) => {
            await interaction.deferReply();
            logger.debug('Interaction deferred.');

            const componentId = interaction.customId.split('_')[0];
            const referenceId = interaction.customId.split('_')[1];

            logger.debug(`Parsed componentId: ${componentId}`);

            const componentModule = await import(`../../interactions/components/${componentId}.js`);
            const { default: component } = componentModule;

            logger.debug('Executing component interaction.');
            await component.execute({ interaction, referenceId, executionId });
        };

        const handleAutocomplete = async (interaction: AutocompleteInteraction) => {
            const autocompleteModule = await import(`../../interactions/autocomplete/${interaction.commandName}.js`);
            const { default: autocomplete } = autocompleteModule;

            logger.debug('Executing autocomplete interaction.');
            await autocomplete.execute({ interaction, executionId });
        };

        const handleCommand = async (interaction: ChatInputCommandInteraction) => {
            await interaction.deferReply();
            logger.debug('Interaction deferred.');

            const command = client.commands?.get(interaction.commandName) as Command;
            if (!command) {
                logger.warn(`Interaction created but command '${interaction.commandName}' was not found.`);
                return;
            }

            logger.debug(`Chat input command interaction created for '${interaction.commandName}'.`);

            if (await cannotSendMessageInChannel({ interaction, executionId })) {
                return;
            }

            logger.debug('Executing command interaction.');
            await command.execute({ interaction, client, executionId });
        };

        // TODO: Extract the text to a config file?
        const errorReply = {
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${embedOptions.icons.error} Uh-oh... _Something_ went wrong!**\nThere was an unexpected error while trying to perform this action. You can try again.\n\n_If this problem persists, please submit a bug report in the **[support server](${botOptions.serverInviteUrl})**._`
                    )
                    .setColor(embedOptions.colors.error)
                    .setFooter({ text: `Execution ID: ${executionId}` })
            ]
        };

        // TODO: extract handlError to own file (create errorHandler and export handleInteractionError?)
        const handleError = async (interaction: Interaction, error: CustomError) => {
            logger.error(error, `Error handling interaction '${interactionIdentifier}'`);

            if (interaction instanceof ChatInputCommandInteraction && interaction.deferred) {
                switch (interaction.replied) {
                    case true:
                        // This means interaction has received a reply already.
                        // Most likely command executed successfully or error is already handled.
                        logger.warn(
                            error,
                            `Interaction '${interaction.id}' threw an error but has already been replied to.`
                        );
                        return;
                    case false:
                        // If the interaction has not been replied to, most likely command execution failed.
                        logger.debug('Responding with error embed');
                        return await interaction.editReply(errorReply);
                }
            } else if (interaction instanceof MessageComponentInteraction && interaction.deferred) {
                switch (interaction.replied) {
                    case true:
                        // This means interaction has received a reply already.
                        // Most likely command executed successfully or error is already handled.
                        logger.warn(
                            error,
                            `Interaction '${interaction.id}' threw an error but has already been replied to.`
                        );
                        return;
                    case false:
                        // If the interaction has not been replied to, most likely command execution failed.
                        logger.debug('Responding with error embed');
                        return await interaction.editReply(errorReply);
                }
            } else {
                logger.warn(
                    'Interaction threw an error but was not deferred or replied to, or was an autocomplete interaction. Cannot send error reply.'
                );

                if (
                    error.code === 'InteractionCollectorError' ||
                    error.message === 'Collector received no interactions before ending with reason: time'
                ) {
                    logger.debug('Interaction response timed out.');
                    return;
                }

                // If this code is reached there is an error that is not handled at all.
                // This should not happen, but if it does, we log it with 'fatal' level to investigate.
                // This is to prevent the bot from crashing or doing something very unexpected.
                logger.fatal(error, 'Unhandled error while awaiting or handling component interaction.');
                return;
            }
        };

        try {
            logger.debug('Started handling interaction.');
            switch (interaction.type as InteractionType) {
                case InteractionType.ApplicationCommand:
                    await handleCommand(interaction as ChatInputCommandInteraction);
                    break;

                case InteractionType.ApplicationCommandAutocomplete:
                    await handleAutocomplete(interaction as AutocompleteInteraction);
                    break;

                case InteractionType.MessageComponent:
                    await handleComponent(interaction as MessageComponentInteraction);
                    break;

                default:
                    logger.error(
                        interaction,
                        `Interaction of type '${interaction.type}' was not handled, interaction attached as object.`
                    );
                    break;
            }
        } catch (error) {
            logger.debug('Error while handling received interaction.');
            await handleError(interaction, error as CustomError);
        }

        const outputTime: number = new Date().getTime();
        const executionTime: number = outputTime - inputTime;

        logger.info(`Interaction '${interactionIdentifier}' handled in ${executionTime} ms.`);

        if (executionTime > 10000) {
            logger.warn(`Interaction '${interactionIdentifier}' took ${executionTime} ms to execute.`);
        }

        return;
    }
};
