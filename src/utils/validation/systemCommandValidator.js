const config = require('config');
const embedOptions = config.get('embedOptions');
const systemOptions = config.get('systemOptions');
const { EmbedBuilder } = require('discord.js');

exports.notValidGuildId = async ({ interaction, executionId }) => {
    const logger = require('../../services/logger').child({
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
            `User tried to use command ${interaction.commandName} but system command cannot be executed in the specified guild.`
        );
        return true;
    }

    return false;
};
