const logger = require('../../services/logger');
const config = require('config');
const embedOptions = config.get('embedOptions');
const { EmbedBuilder } = require('discord.js');

exports.notInVoiceChannel = async (interaction) => {
    if (!interaction.member.voice.channel) {
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${embedOptions.icons.warning} Not in a voice channel**\nYou need to be in a voice channel to use this command.`
                    )
                    .setColor(embedOptions.colors.warning)
            ]
        });

        logger.debug(`User tried to use command ${interaction.commandName} but was not in a voice channel.`);
        return true;
    }

    return false;
};

exports.notInSameVoiceChannel = async (interaction, queue) => {
    if (!queue || !queue.dispatcher) {
        // If there is no queue or bot is not in voice channel, then there is no need to check if user is in same voice channel.
        return false;
    }

    if (interaction.member.voice.channel.id !== queue.dispatcher.channel.id) {
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${embedOptions.icons.warning} Not in same voice channel**\nYou need to be in the same voice channel as me to use this command.\n\n**Voice channel:** ${queue.dispatcher.channel.name}`
                    )
                    .setColor(embedOptions.colors.warning)
            ]
        });

        logger.debug(`User tried to use command ${interaction.commandName} but was not in the same voice channel.`);
        return true;
    }

    return false;
};
