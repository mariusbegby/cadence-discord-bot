const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');
const { EmbedBuilder } = require('discord.js');
const { embedColors, embedIcons } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Remove a specific track from the queue.')
        .setDMPermission(false)
        .addNumberOption((option) =>
            option
                .setName('tracknumber')
                .setDescription('Track number to remove from queue.')
                .setMinValue(1)
                .setRequired(true)
        ),
    run: async ({ interaction }) => {
        if (!interaction.member.voice.channel) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${embedIcons.warning} Oops!**\nYou need to be in a voice channel to use this command.`
                        )
                        .setColor(embedColors.colorWarning)
                ]
            });
        }

        const queue = useQueue(interaction.guild.id);

        if (!queue) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${embedIcons.warning} Oops!**\nThere are no tracks in the queue and nothing currently playing. First add some tracks with \`/play\`!`
                        )
                        .setColor(embedColors.colorWarning)
                ]
            });
        }

        const removeTrackNumber = interaction.options.getNumber('tracknumber');

        if (removeTrackNumber > queue.tracks.data.length) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${embedIcons.warning} Oops!**\nTrack \`${removeTrackNumber}\` is not a valid track number. There are a total of\`${queue.tracks.data.length}\` tracks in the queue.\n\nView tracks added to the queue with \`/queue\`.`
                        )
                        .setColor(embedColors.colorWarning)
                ]
            });
        }

        // Remove specified track number from queue
        const removedTrack = queue.node.remove(removeTrackNumber - 1);
        let durationFormat =
            removedTrack.raw.duration === 0 || removedTrack.duration === '0:00'
                ? ''
                : `\`${removedTrack.duration}\``;

        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name:
                            interaction.member.nickname ||
                            interaction.user.username,
                        iconURL: interaction.user.avatarURL()
                    })
                    .setDescription(
                        `**${embedIcons.success} Removed track**\n${durationFormat} **[${removedTrack.title}](${removedTrack.url})**`
                    )
                    .setThumbnail(removedTrack.thumbnail)
                    .setColor(embedColors.colorSuccess)
            ]
        });
    }
};
