import config from 'config';
import { EmbedBuilder } from 'discord.js';

import loggerModule from '../../services/logger';
import { EmbedOptions, SystemOptions } from '../../types/configTypes';
import { NotValidGuildIdParams } from '../../types/utilTypes';

const embedOptions: EmbedOptions = config.get('embedOptions');
const systemOptions: SystemOptions = config.get('systemOptions');
export const notValidGuildId = async ({ interaction, executionId }: NotValidGuildIdParams) => {
    const logger = loggerModule.child({
        source: 'systemCommandValidator.js',
        module: 'utilValidation',
        name: 'notValidGuildId',
        executionId: executionId,
        shardId: interaction.guild?.shardId,
        guildId: interaction.guild?.id
    });

    if (interaction.guildId && !systemOptions.systemGuildIds.includes(interaction.guildId)) {
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
