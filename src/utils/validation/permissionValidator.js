const logger = require('../../services/logger');
const { embedOptions } = require('../../config');
const { EmbedBuilder } = require('discord.js');

exports.cannotJoinVoiceOrTalk = async (interaction) => {
    const channel = interaction.member.voice.channel;

    if (!channel.joinable || !channel.speakable) {
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${embedOptions.icons.warning} Oops!**\nI do not have permission to play audio in the voice channel you are in.\n\nPlease make sure I have the **Connect** and **Speak** permissions in this voice channel.`
                    )
                    .setColor(embedOptions.colors.warning)
            ]
        });

        logger.debug(`User tried to use command ${interaction.commandName} but was not in a voice channel.`);
        return true;
    }

    return false;
};
