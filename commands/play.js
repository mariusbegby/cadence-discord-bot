const { SlashCommandBuilder } = require('@discordjs/builders');
const { useMainPlayer, useQueue } = require('discord-player');
const { EmbedBuilder } = require('discord.js');
const {
    embedColors,
    embedIcons,
    playerOptions,
    botInfo
} = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription(
            'Add a track or playlist to the queue by searching or url.'
        )
        .setDMPermission(false)
        .addStringOption((option) =>
            option
                .setName('query')
                .setDescription('Search query or URL.')
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

        const player = useMainPlayer();
        const query = interaction.options.getString('query');

        const searchResult = await player.search(query, {
            requestedBy: interaction.user
        });

        if (!searchResult || searchResult.tracks.length === 0) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${embedIcons.warning} No track found**\nNo results found for \`${query}\`.\n\nIf you specified a URL, please make sure it is valid and public.`
                        )
                        .setColor(embedColors.colorWarning)
                ]
            });
        }

        if (
            searchResult.tracks[0].raw.live &&
            searchResult.tracks[0].raw.duration === 0 &&
            searchResult.tracks[0].source === 'youtube'
        ) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${embedIcons.warning} Unsupported audio source**\nYouTube live streams are currently not supported. This is due to issues with extracting audio from the livestream.\n\n_If you think this message is incorrect, please submit a bug report in the **[support server](${botInfo.supportServerInviteUrl})**._`
                        )
                        .setColor(embedColors.colorWarning)
                ]
            });
        }

        let track;

        try {
            ({ track } = await player.play(
                interaction.member.voice.channel,
                searchResult,
                {
                    requestedBy: interaction.user,
                    nodeOptions: {
                        leaveOnEmpty: playerOptions.leaveOnEmpty ?? true,
                        leaveOnEmptyCooldown:
                            playerOptions.leaveOnEmptyCooldown ?? 60000,
                        leaveOnEnd: playerOptions.leaveOnEnd ?? true,
                        leaveOnEndCooldown:
                            playerOptions.leaveOnEndCooldown ?? 60000,
                        leaveOnStop: playerOptions.leaveOnStop ?? true,
                        leaveOnStopCooldown:
                            playerOptions.leaveOnStopCooldown ?? 60000,
                        maxSize: playerOptions.maxQueueSize ?? 1000,
                        maxHistorySize: playerOptions.maxHistorySize ?? 100,
                        volume: playerOptions.defaultVolume ?? 50
                    }
                }
            ));
        } catch (error) {
            if (error.message.includes('Sign in to confirm your age')) {
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(
                                `**${embedIcons.warning} Cannot retrieve audio for track**\nThis audio source is age restricted and requires login to access. Because of this I cannot retrieve the audio for the track.\n\n_If you think this message is incorrect, please submit a bug report in the **[support server](${botInfo.supportServerInviteUrl})**._`
                            )
                            .setColor(embedColors.colorWarning)
                    ]
                });
            }

            if (
                (error.type === 'TypeError' &&
                    (error.message.includes(
                        'Cannot read properties of null (reading \'createStream\')'
                    ) ||
                        error.message.includes(
                            'Failed to fetch resources for ytdl streaming'
                        ))) ||
                error.message.includes(
                    'Could not extract stream for this track'
                )
            ) {
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(
                                `**${embedIcons.error} Uh-oh... Failed to add track!**\nAfter finding a result, I was unable to retrieve audio for the track.\n\nYou can try to perform the command again.\n\n_If you think this message is incorrect, please submit a bug report in the **[support server](${botInfo.supportServerInviteUrl})**._`
                            )
                            .setColor(embedColors.colorError)
                    ]
                });
            }

            if (error.message === 'Cancelled') {
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(
                                `**${embedIcons.error} Uh-oh... Failed to add track!**\nSomething unexpected happened and the operation was cancelled.\n\nYou can try to perform the command again.\n\n_If you think this message is incorrect, please submit a bug report in the **[support server](${botInfo.supportServerInviteUrl})**._`
                            )
                            .setColor(embedColors.colorError)
                    ]
                });
            }
        }

        let queue = useQueue(interaction.guild.id);

        if (!queue) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${embedIcons.error} Uh-oh... Failed to add track!**\nThere was an issue adding this track to the queue.\n\nYou can try to perform the command again.\n\n_If this problem persists, please submit a bug report in the **[support server](${botInfo.supportServerInviteUrl})**._`
                        )
                        .setColor(embedColors.colorError)
                ]
            });
        }

        if (track.source === 'arbitrary') {
            track.thumbnail =
                'https://raw.githubusercontent.com/mariusbegby/cadence-discord-bot/main/assets/logo-rounded-128px.png';
        }

        let durationFormat =
            track.raw.duration === 0 || track.duration === '0:00'
                ? ''
                : `\`${track.duration}\``;

        if (searchResult.playlist && searchResult.tracks.length > 1) {
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
                            `**${
                                embedIcons.success
                            } Added playlist to queue**\n${durationFormat} **[${
                                track.title
                            }](${track.url})**\n\nAnd **${
                                searchResult.tracks.length - 1
                            }** more tracks... \`/queue\` to view all.`
                        )
                        .setThumbnail(track.thumbnail)
                        .setColor(embedColors.colorSuccess)
                ]
            });
        }

        if (queue.currentTrack === track) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name:
                                interaction.member.nickname ||
                                interaction.member.nickname ||
                                interaction.user.username,
                            iconURL: interaction.user.avatarURL()
                        })
                        .setDescription(
                            `**${embedIcons.audioStartedPlaying} Started playing**\n${durationFormat} **[${track.title}](${track.url})**`
                        )
                        .setThumbnail(track.thumbnail)
                        .setColor(embedColors.colorSuccess)
                ]
            });
        }

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
                        `${embedIcons.success} **Added to queue**\n${durationFormat} **[${track.title}](${track.url})**`
                    )
                    .setThumbnail(track.thumbnail)
                    .setColor(embedColors.colorSuccess)
            ]
        });
    }
};
