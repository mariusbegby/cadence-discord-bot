const logger = require('../../services/logger');
const { embedOptions, playerOptions } = require('../../config');
const { notInVoiceChannel } = require('../../utils/validation/voiceChannelValidation');
const { queueDoesNotExist, queueNoCurrentTrack } = require('../../utils/validation/queueValidation');
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Show information about the track currently playing.')
        .setDMPermission(false),
    execute: async ({ interaction }) => {
        if (await notInVoiceChannel(interaction)) {
            return;
        }

        const queue = useQueue(interaction.guild.id);

        if (await queueDoesNotExist(interaction, queue)) {
            return;
        }

        if (await queueNoCurrentTrack(interaction, queue)) {
            return;
        }

        const sourceStringsFormatted = new Map([
            ['youtube', 'YouTube'],
            ['soundcloud', 'SoundCloud'],
            ['spotify', 'Spotify'],
            ['apple_music', 'Apple Music'],
            ['arbitrary', 'Direct source']
        ]);

        const sourceIcons = new Map([
            ['youtube', embedOptions.icons.sourceYouTube],
            ['soundcloud', embedOptions.icons.sourceSoundCloud],
            ['spotify', embedOptions.icons.sourceSpotify],
            ['apple_music', embedOptions.icons.sourceAppleMusic],
            ['arbitrary', embedOptions.icons.sourceArbitrary]
        ]);

        const currentTrack = queue.currentTrack;

        let author = currentTrack.author ? currentTrack.author : 'Unavailable';
        if (author === 'cdn.discordapp.com') {
            author = 'Unavailable';
        }
        let plays = currentTrack.views !== 0 ? currentTrack.views : 0;

        if (
            plays === 0 &&
            currentTrack.metadata.bridge &&
            currentTrack.metadata.bridge.views !== 0 &&
            currentTrack.metadata.bridge.views !== undefined
        ) {
            plays = currentTrack.metadata.bridge.views;
        } else if (plays === 0) {
            plays = 'Unavailable';
        }

        const source = sourceStringsFormatted.get(currentTrack.raw.source) ?? 'Unavailable';
        const queueLength = queue.tracks.data.length;
        const timestamp = queue.node.getTimestamp();
        let bar = `**\`${timestamp.current.label}\`** ${queue.node.createProgressBar({
            queue: false,
            length: playerOptions.progressBar.length ?? 12,
            timecodes: playerOptions.progressBar.timecodes ?? false,
            indicator: playerOptions.progressBar.indicator ?? '🔘',
            leftChar: playerOptions.progressBar.leftChar ?? '▬',
            rightChar: playerOptions.progressBar.rightChar ?? '▬'
        })} **\`${timestamp.total.label}\`**`;

        if (currentTrack.raw.duration === 0 || currentTrack.duration === '0:00') {
            bar = 'No duration available.';
        }

        const nowPlayingActionRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('nowplaying-skip')
                .setLabel('Skip track')
                .setStyle('Secondary')
                .setEmoji(embedOptions.icons.nextTrack)
        );

        const loopModesFormatted = new Map([
            [0, 'disabled'],
            [1, 'track'],
            [2, 'queue'],
            [3, 'autoplay']
        ]);

        const loopModeUserString = loopModesFormatted.get(queue.repeatMode);

        logger.debug(`User used command ${interaction.commandName}, finished intializing data.`);

        const response = await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: `Channel: ${queue.channel.name} (${queue.channel.bitrate / 1000}kbps)`,
                        iconURL: interaction.guild.iconURL()
                    })
                    .setDescription(
                        (queue.node.isPaused()
                            ? '**Currently Paused**\n'
                            : `**${embedOptions.icons.audioPlaying} Now Playing**\n`) +
                            `**[${currentTrack.title}](${currentTrack.url})**` +
                            `\nRequested by: <@${currentTrack.requestedBy.id}>` +
                            `\n ${bar}\n\n` +
                            `${
                                queue.repeatMode === 0
                                    ? ''
                                    : `**${
                                        queue.repeatMode === 3 ? embedOptions.icons.autoplay : embedOptions.icons.loop
                                    } Looping**\nLoop mode is set to ${loopModeUserString}. You can change it with **\`/loop\`**.`
                            }`
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
                            name: '**Track source**',
                            value: `**${sourceIcons.get(currentTrack.raw.source)} [${source}](${currentTrack.url})**`,
                            inline: true
                        }
                    )
                    .setFooter({
                        text: queueLength ? `${queueLength} other tracks in the queue...` : ' '
                    })
                    .setThumbnail(queue.currentTrack.thumbnail)
                    .setColor(embedOptions.colors.info)
            ],
            components: [nowPlayingActionRow]
        });

        logger.debug(`User used command ${interaction.commandName}, finished sending response.`);

        const collectorFilter = (i) => i.user.id === interaction.user.id;
        try {
            const confirmation = await response.awaitMessageComponent({
                filter: collectorFilter,
                time: 60000
            });

            confirmation.deferUpdate();

            if (confirmation.customId === 'nowplaying-skip') {
                logger.debug(`User used command ${interaction.commandName}, received skip confirmation.`);
                if (!queue || (queue.tracks.data.length === 0 && !queue.currentTrack)) {
                    logger.debug(
                        `User used command ${interaction.commandName} and tried skipping but there was no queue.`
                    );
                    return await interaction.followUp({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(
                                    `**${embedOptions.icons.warning} Oops!**\nThere is nothing currently playing. First add some tracks with **\`/play\`**!`
                                )
                                .setColor(embedOptions.colors.warning)
                        ],
                        components: []
                    });
                }

                if (queue.currentTrack !== currentTrack) {
                    logger.debug(
                        `User used command ${interaction.commandName} and tried skipping but the track was already removed.`
                    );
                    return await interaction.followUp({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(
                                    `**${embedOptions.icons.warning} Oops!**\nThis track has already been skipped or is no longer playing.`
                                )
                                .setColor(embedOptions.colors.warning)
                        ],
                        components: []
                    });
                }

                const skippedTrack = queue.currentTrack;
                let durationFormat =
                    skippedTrack.raw.duration === 0 || skippedTrack.duration === '0:00'
                        ? ''
                        : `\`${skippedTrack.duration}\``;
                queue.node.skip();

                const repeatModeUserString = loopModesFormatted.get(queue.repeatMode);

                logger.debug(`User used command ${interaction.commandName} and skipped the track.`);
                return await interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({
                                name: interaction.member.nickname || interaction.user.username,
                                iconURL: interaction.user.avatarURL()
                            })
                            .setDescription(
                                `**${embedOptions.icons.skipped} Skipped track**\n**${durationFormat} [${skippedTrack.title}](${skippedTrack.url})**` +
                                    `${
                                        queue.repeatMode === 0
                                            ? ''
                                            : `\n\n**${
                                                queue.repeatMode === 3
                                                    ? embedOptions.icons.autoplaying
                                                    : embedOptions.icons.looping
                                            } Looping**\nLoop mode is set to ${repeatModeUserString}. You can change it with **\`/loop\`**.`
                                    }`
                            )
                            .setThumbnail(skippedTrack.thumbnail)
                            .setColor(embedOptions.colors.success)
                    ],
                    components: []
                });
            }
        } catch (error) {
            if (error.code === 'InteractionCollectorError') {
                logger.debug(`User used command ${interaction.commandName} but did not respond to the skip prompt.`);
                return;
            }

            logger.debug(error, `User used command ${interaction.commandName} but there was an unhandled error.`);
            throw error;
        }
    }
};
