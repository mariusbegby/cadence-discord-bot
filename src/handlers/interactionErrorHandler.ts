import config from 'config';
import { ChatInputCommandInteraction, EmbedBuilder, Interaction, MessageComponentInteraction } from 'discord.js';
import { BotOptions, EmbedOptions } from '../types/configTypes';
import loggerModule from '../services/logger';
import { CustomError } from '../types/interactionTypes';

const embedOptions: EmbedOptions = config.get('embedOptions');
const botOptions: BotOptions = config.get('botOptions');

const logger = loggerModule.child({
    source: 'interactionErrorHandler.ts',
    module: 'handler',
    name: 'interactionErrorHandler'
});

export const handleError = async (
    interaction: Interaction,
    error: CustomError,
    interactionIdentifier: string,
    executionId: string
) => {
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

    logger.error(error, `Error handling interaction '${interactionIdentifier}'`);

    if (interaction instanceof ChatInputCommandInteraction && interaction.deferred) {
        switch (interaction.replied) {
            case true:
                logger.warn(error, `Interaction '${interaction.id}' threw an error but has already been replied to.`);
                return;
            case false:
                logger.debug('Responding with error embed');
                return await interaction.editReply(errorReply);
        }
    } else if (interaction instanceof MessageComponentInteraction && interaction.deferred) {
        switch (interaction.replied) {
            case true:
                logger.warn(error, `Interaction '${interaction.id}' threw an error but has already been replied to.`);
                return;
            case false:
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

        logger.fatal(error, 'Unhandled error while awaiting or handling component interaction.');
        return;
    }
};
