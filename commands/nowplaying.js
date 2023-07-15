const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const {
    embedColors,
    embedIcons,
    progressBarOptions
} = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Show information about the track currently playing.')
        .setDMPermission(false),
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

        if (!queue.currentTrack) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${embedIcons.warning} Oops!**\nThere is nothing currently playing. First add some tracks with \`/play\`!`
                        )
                        .setColor(embedColors.colorWarning)
                ]
            });
        }

        const sourceStringsFormatted = new Map([
            ['youtube', 'YouTube'],
            ['soundcloud', 'SoundCloud'],
            ['spotify', 'Spotify'],
            ['apple_music', 'Apple Music'],
            ['arbitrary', 'Direct source']
        ]);

        const currentTrack = queue.currentTrack;
        let author = currentTrack.author ? currentTrack.author : 'Unavailable';
        if (author === 'cdn.discordapp.com') {
            author = 'Unavailable';
        }
        const plays =
            currentTrack.views !== 0 ? currentTrack.views : 'Unavailable';
        const source =
            sourceStringsFormatted.get(currentTrack.raw.source) ??
            'Unavailable';
        const queueLength = queue.tracks.data.length;
        const timestamp = queue.node.getTimestamp();
        let bar = `\`${
            timestamp.current.label
        }\` ${queue.node.createProgressBar({
            queue: false,
            length: progressBarOptions.length ?? 12,
            timecodes: progressBarOptions.timecodes ?? false,
            indicator: progressBarOptions.indicator ?? '🔘',
            leftChar: progressBarOptions.leftChar ?? '▬',
            rightChar: progressBarOptions.rightChar ?? '▬'
        })} \`${timestamp.total.label}\``;

        if (
            currentTrack.raw.duration === 0 ||
            currentTrack.duration === '0:00'
        ) {
            bar = 'No duration available.';
        }

        const nowPlayingActionRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('nowplaying-skip')
                .setLabel('Skip track')
                .setStyle('Secondary')
                .setEmoji(embedIcons.nextTrack)
        );

        const response = await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: `Channel: ${queue.channel.name} (${
                            queue.channel.bitrate / 1000
                        }kbps)`,
                        iconURL: interaction.guild.iconURL()
                    })
                    .setDescription(
                        (queue.node.isPaused()
                            ? '**Currently Paused**\n'
                            : `**${embedIcons.audioPlaying} Now Playing**\n`) +
                            (currentTrack
                                ? `**[${currentTrack.title}](${currentTrack.url})**`
                                : 'None') +
                            `\nRequested by: <@${currentTrack.requestedBy.id}>` +
                            `\n ${bar}\n\n`
                    )
                    .addFields(
                        {
                            name: '**Author**',
                            value: author,
                            inline: true
                        },
                        {
                            name: '**Plays**',
                            value: plays.toLocaleString('en-US'),
                            inline: true
                        },
                        {
                            name: '**Audio source**',
                            value: `**[${source}](${currentTrack.url})**`,
                            inline: true
                        }
                    )
                    .setFooter({
                        text: queueLength
                            ? `${queueLength} other tracks in the queue...`
                            : ' '
                    })
                    .setThumbnail(queue.currentTrack.thumbnail)
                    .setColor(embedColors.colorInfo)
            ],
            components: [nowPlayingActionRow]
        });

        const collectorFilter = (i) => i.user.id === interaction.user.id;
        try {
            const confirmation = await response.awaitMessageComponent({
                filter: collectorFilter,
                time: 60000
            });

            confirmation.deferUpdate();

            if (confirmation.customId === 'nowplaying-skip') {
                if (
                    !queue ||
                    (queue.tracks.data.length === 0 && !queue.currentTrack)
                ) {
                    return await interaction.followUp({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(
                                    `**${embedIcons.warning} Oops!**\nThere is nothing currently playing. First add some tracks with \`/play\`!`
                                )
                                .setColor(embedColors.colorWarning)
                        ],
                        components: []
                    });
                }

                if (queue.currentTrack !== currentTrack) {
                    return await interaction.followUp({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(
                                    '**${embedIcons.warning} Oops!**\nThis track has already been skipped or is no longer playing.'
                                )
                                .setColor(embedColors.colorWarning)
                        ],
                        components: []
                    });
                }

                const skippedTrack = queue.currentTrack;
                let durationFormat =
                    skippedTrack.raw.duration === 0 ||
                    skippedTrack.duration === '0:00'
                        ? ''
                        : `\`${skippedTrack.duration}\``;
                queue.node.skip();

                return await interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({
                                name: interaction.user.username,
                                iconURL: interaction.user.avatarURL()
                            })
                            .setDescription(
                                `**${embedIcons.skipped} Skipped track**\n${durationFormat} **[${skippedTrack.title}](${skippedTrack.url})**.`
                            )
                            .setThumbnail(skippedTrack.thumbnail)
                            .setColor(embedColors.colorSuccess)
                    ],
                    components: []
                });
            }
        } catch (e) {
            if (e.code === 'InteractionCollectorError') {
                return;
            }

            throw e;
        }
    }
};
