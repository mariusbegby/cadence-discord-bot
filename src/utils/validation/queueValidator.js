const logger = require('../../services/logger');
const config = require('config');
const embedOptions = config.get('embedOptions');
const { EmbedBuilder } = require('discord.js');

exports.queueDoesNotExist = async (interaction, queue) => {
    if (!queue) {
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${embedOptions.icons.warning} Oops!**\nThere are no tracks in the queue and nothing currently playing. First add some tracks with **\`/play\`**!`
                    )
                    .setColor(embedOptions.colors.warning)
            ]
        });

        logger.debug(`User tried to use command ${interaction.commandName} but there was no queue.`);

        return true;
    }

    return false;
};

exports.queueNoCurrentTrack = async (interaction, queue) => {
    if (!queue.currentTrack) {
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${embedOptions.icons.warning} Oops!**\nThere is nothing currently playing. First add some tracks with **\`/play\`**!`
                    )
                    .setColor(embedOptions.colors.warning)
            ]
        });

        logger.debug(`User tried to use command ${interaction.commandName} but there was no current track.`);

        return true;
    }

    return false;
};

exports.queueIsEmpty = async (interaction, queue) => {
    if (queue.tracks.data.length === 0) {
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${embedOptions.icons.warning} Oops!**\nThere are no tracks added to the queue. First add some tracks with **\`/play\`**!`
                    )
                    .setColor(embedOptions.colors.warning)
            ]
        });

        logger.debug(`User tried to use command ${interaction.commandName} but there was no tracks in the queue.`);

        return true;
    }

    return false;
};
