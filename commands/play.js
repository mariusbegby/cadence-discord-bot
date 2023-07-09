const { SlashCommandBuilder } = require('@discordjs/builders');
const { useMainPlayer, useQueue } = require('discord-player');
const { EmbedBuilder } = require('discord.js');
const { embedColors } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a track provided by search terms or URL.')
        .addStringOption((option) =>
            option
                .setName('query')
                .setDescription('Search terms or URL.')
                .setRequired(true)
        ),
    run: async ({ interaction }) => {
        if (!interaction.member.voice.channel) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**Failed**\nYou need to be in a voice channel to use this command.`
                        )
                        .setColor(embedColors.colorWarning)
                ]
            });
        }

        const player = useMainPlayer();
        const query = interaction.options.getString('query');

        const searchResult = await player.search(query);

        if (!searchResult || searchResult.tracks.length === 0) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**No track found**\nNo results found for \`${query}\`.`
                        )
                        .setColor(embedColors.colorWarning)
                ]
            });
        }

        try {
            const { track } = await player.play(
                interaction.member.voice.channel,
                searchResult.tracks[0].url,
                {
                    requestedBy: interaction.user,
                    nodeOptions: {
                        leaveOnEmptyCooldown: 60000,
                        leaveOnEndCooldown: 60000,
                        leaveOnStopCooldown: 60000
                    }
                }
            );

            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: interaction.user.username,
                            iconURL: interaction.user.avatarURL()
                        })
                        .setDescription(
                            `**Added to queue**\n\`[${track.duration}]\` **[${track.title}](${track.url})**`
                        )
                        .setThumbnail(track.thumbnail)
                        .setColor(embedColors.colorSuccess)
                ]
            });
        } catch (e) {
            if (e.message.includes('Could not extract stream for this track')) {
                if (searchResult.tracks.length > 1) {
                    try {
                        const { track } = await player.play(
                            interaction.member.voice.channel,
                            searchResult.tracks[1].url,
                            {
                                requestedBy: interaction.user,
                                nodeOptions: {
                                    leaveOnEmptyCooldown: 60000,
                                    leaveOnEndCooldown: 60000,
                                    leaveOnStopCooldown: 60000
                                }
                            }
                        );

                        return await interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setAuthor({
                                        name: interaction.user.username,
                                        iconURL: interaction.user.avatarURL()
                                    })
                                    .setDescription(
                                        `**Added to queue**\n\`[${track.duration}]\` **[${track.title}](${track.url})**`
                                    )
                                    .setThumbnail(track.thumbnail)
                                    .setColor(embedColors.colorSuccess)
                            ]
                        });
                    } catch (e) {
                        if (
                            e.message.includes(
                                'Could not extract stream for this track'
                            )
                        ) {
                            return await interaction.editReply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setDescription(
                                            `**Failed**\nFound a result for query \`${query}\` with source ${searchResult.tracks[1].url}, but was unable to extract audio stream from track.\n\nThis is most likely due to audio source blocking download from the bot. Please try another track or refine your query.`
                                        )
                                        .setColor(embedColors.colorError)
                                ]
                            });
                        }
                    }
                } else {
                    return await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(
                                    `**Failed**\nFound a result for query \`${query}\` with source ${searchResult.tracks[0].url}, but was unable to extract audio stream from track.\n\nThis is most likely due to audio source blocking download from the bot or unsupported audio encoding. Please try another track or refine your query.`
                                )
                                .setColor(embedColors.colorError)
                        ]
                    });
                }
            } else {
                throw e;
            }
        }
    }
};
