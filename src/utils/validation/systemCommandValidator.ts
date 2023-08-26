import loggerModule from '../../services/logger';

import config from 'config';
import { EmbedOptions } from '../../types/configTypes';
const embedOptions: EmbedOptions = config.get('embedOptions');
const systemOptions = config.get('systemOptions');
import { EmbedBuilder } from 'discord.js';

export const notValidGuildId = async ({ interaction, executionId }) => {
    const logger = loggerModule.child({
        source: 'systemCommandValidator.js',
        module: 'utilValidation',
        name: 'notValidGuildId',
        executionId: executionId,
        shardId: interaction.guild.shardId,
        guildId: interaction.guild.id
    });

    if (!systemOptions.systemGuildIds.includes(interaction.guildId)) {
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${embedOptions.icons.warning} Oops!**\nNo permission to execute this command.\n\nThe command \`${interaction.commandName}\` cannot be executed in this server.`
                    )
                    .setColor(embedOptions.colors.warning)
            ]
        });

        logger.debug(
            `User tried to use command '${interaction.commandName}' but system command cannot be executed in the specified guild.`
        );
        return true;
    }

    return false;
};
