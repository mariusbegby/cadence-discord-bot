import config from 'config';
import { EmbedBuilder, InteractionType } from 'discord.js';
import { Logger } from 'pino';
import { InteractionValidationError } from '../../classes/interactions';
import loggerModule from '../../services/logger';
import { EmbedOptions, SystemOptions } from '../../types/configTypes';
import { ValidatorParams } from '../../types/utilTypes';

const embedOptions: EmbedOptions = config.get('embedOptions');
const systemOptions: SystemOptions = config.get('systemOptions');
export const checkValidGuildId = async ({ interaction, executionId }: ValidatorParams) => {
    const logger: Logger = loggerModule.child({
        module: 'utilValidation',
        name: 'notValidGuildId',
        executionId: executionId,
        shardId: interaction.guild?.shardId,
        guildId: interaction.guild?.id
    });

    const interactionIdentifier =
        interaction.type === InteractionType.ApplicationCommand ? interaction.commandName : interaction.customId;

    if (interaction.guildId && !systemOptions.systemGuildIds.includes(interaction.guildId)) {
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${embedOptions.icons.warning} Oops!**\nNo permission to perform this action.\n\nThe command **\`/${interactionIdentifier}\`** cannot be executed in this server.`
                    )
                    .setColor(embedOptions.colors.warning)
            ]
        });

        logger.debug(
            `User tried to use command '${interactionIdentifier}' but system command cannot be executed in the specified guild.`
        );
        throw new InteractionValidationError('System command cannot be executed in the specified guild.');
    }

    return;
};
