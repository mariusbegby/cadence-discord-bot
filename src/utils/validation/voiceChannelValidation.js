const logger = require('../../services/logger');
const { embedOptions } = require('../../config');
const { EmbedBuilder } = require('discord.js');

exports.notInVoiceChannel = async (interaction) => {
    if (!interaction.member.voice.channel) {
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${embedOptions.icons.warning} Oops!**\nYou need to be in a voice channel to use this command.`
                    )
                    .setColor(embedOptions.colors.warning)
            ]
        });

        logger.debug(`User tried to use command ${interaction.commandName} but was not in a voice channel.`);
        return true;
    }

    return false;
};
