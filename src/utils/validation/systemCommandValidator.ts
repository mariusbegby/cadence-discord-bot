import config from 'config';
import { EmbedBuilder, InteractionType } from 'discord.js';

import loggerModule from '../../services/logger';
import { EmbedOptions, SystemOptions } from '../../types/configTypes';
import { NotValidGuildIdParams } from '../../types/utilTypes';
import { Logger } from 'pino';

const embedOptions: EmbedOptions = config.get('embedOptions');
const systemOptions: SystemOptions = config.get('systemOptions');
export const notValidGuildId = async ({ interaction, executionId }: NotValidGuildIdParams) => {
    const logger: Logger = loggerModule.child({
        source: 'systemCommandValidator.js',
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
                        `**${this.embedOptions.icons.warning} Oops!**\nNo permission to execute this command.\n\nThe command **\`/${interactionIdentifier}\`** cannot be executed in this server.`
                    )
                    .setColor(this.embedOptions.colors.warning)
            ]
        });

        logger.debug(
            `User tried to use command '${interactionIdentifier}' but system command cannot be executed in the specified guild.`
        );
        return true;
    }

    return false;
};
