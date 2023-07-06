const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the currently playing track.')
        .addNumberOption((option) =>
            option
                .setName('tracknumber')
                .setDescription(
                    'Skip to next track or the given track number in the queue.'
                )
                .setMinValue(1)
        ),
    run: async ({ interaction }) => {
        if (!interaction.member.voice.channel) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**Error**\nYou need to be in a voice channel to use this command.`
                        )
                        .setColor('#c70057')
                ]
            });
        }

        const queue = useQueue(interaction.guild.id);

        if (!queue) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`**Error**\nThere are no tracks in the queue.`)
                        .setColor('#c70057')
                ]
            });
        }

        const skipToTrack = interaction.options.getNumber('tracknumber');

        if (skipToTrack) {
            if (skipToTrack > queue.tracks.data.length) {
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(
                                `**Error**\nThere are \`${queue.tracks.data.length}\` tracks in the queue. You cannot skip to track number \`${skipToTrack}\`.`
                            )
                            .setColor('#c70057')
                    ]
                });
            } else {
                const skippedTrack = queue.currentTrack;
                queue.node.skipTo(skipToTrack - 1);

                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({
                                name: interaction.user.username,
                                iconURL: interaction.user.avatarURL()
                            })
                            .setDescription(
                                `**Skipped**\n**[${skippedTrack.title}](${skippedTrack.url})**.`
                            )
                            .setThumbnail(skippedTrack.thumbnail)
                            .setColor('#4c73df')
                    ]
                });
            }
        } else {
            const skippedTrack = queue.currentTrack;
            queue.node.skip();

            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: interaction.user.username,
                            iconURL: interaction.user.avatarURL()
                        })
                        .setDescription(
                            `**Skipped**\n**[${skippedTrack.title}](${skippedTrack.url})**.`
                        )
                        .setThumbnail(skippedTrack.thumbnail)
                        .setColor('#4c73df')
                ]
            });
        }
    }
};
