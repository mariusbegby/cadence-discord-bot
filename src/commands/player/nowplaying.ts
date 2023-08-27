import config from 'config';
import { EmbedOptions } from '../../types/configTypes';
const embedOptions: EmbedOptions = config.get('embedOptions');
const playerOptions: PlayerOptions = config.get('playerOptions');
import { notInVoiceChannel, notInSameVoiceChannel } from '../../utils/validation/voiceChannelValidator';
import { queueDoesNotExist, queueNoCurrentTrack } from '../../utils/validation/queueValidator';
import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } from 'discord.js';
import { useQueue } from 'discord-player';
import loggerModule from '../../services/logger';
import { CommandParams } from '../../types/commandTypes';

module.exports = {
    isNew: false,
    isBeta: false,
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Show information about the track currently playing.')
        .setDMPermission(false)
        .setNSFW(false),
    execute: async ({ interaction, executionId }: CommandParams) => {
        const logger = loggerModule.child({
            source: 'nowplaying.js',
            module: 'slashCommand',
            name: '/nowplaying',
            executionId: executionId,
            shardId: interaction.guild.shardId,
            guildId: interaction.guild.id
        });

        if (await notInVoiceChannel({ interaction, executionId })) {
            return;
        }

        const queue = useQueue(interaction.guild.id);

        if (await queueDoesNotExist({ interaction, queue, executionId })) {
            return;
        }

        if (await notInSameVoiceChannel({ interaction, queue, executionId })) {
            return;
        }

        if (await queueNoCurrentTrack({ interaction, queue, executionId })) {
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
            bar = '_No duration available._';
        }

        if (currentTrack.raw.live) {
            bar = `${embedOptions.icons.liveTrack} **\`LIVE\`** - Playing continuously from live source.`;
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

        logger.debug('Successfully retrieved information about the current track.');

        logger.debug('Sending info embed with action row components.');
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
                            `**[${currentTrack.title}](${currentTrack.raw.url ?? currentTrack.url})**` +
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
                            value: `**${sourceIcons.get(currentTrack.raw.source)} [${source}](${
                                currentTrack.raw.url ?? currentTrack.url
                            })**`,
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

        logger.debug('Finished sending response.');

        const collectorFilter = (i) => i.user.id === interaction.user.id;
        try {
            const confirmation = await response.awaitMessageComponent({
                filter: collectorFilter,
                time: 300_000
            });

            confirmation.deferUpdate();

            logger.debug('Received component interaction response.');

            if (confirmation.customId === 'nowplaying-skip') {
                logger.debug('Received skip confirmation.');
                if (!queue || (queue.tracks.data.length === 0 && !queue.currentTrack)) {
                    logger.debug('Tried skipping track but there was no queue.');

                    logger.debug('Responding with warning embed.');
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
                        'Tried skipping track but it is not the current track and therefore already skipped/removed.'
                    );

                    logger.debug('Responding with warning embed.');
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

                if (skippedTrack.raw.live) {
                    durationFormat = `${embedOptions.icons.liveTrack} \`LIVE\``;
                }
                queue.node.skip();
                logger.debug('Skipped the track.');

                const repeatModeUserString = loopModesFormatted.get(queue.repeatMode);

                logger.debug('Responding with success embed.');
                return await interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({
                                name: interaction.member.nickname || interaction.user.username,
                                iconURL: interaction.user.avatarURL()
                            })
                            .setDescription(
                                `**${embedOptions.icons.skipped} Skipped track**\n**${durationFormat} [${
                                    skippedTrack.title
                                }](${skippedTrack.raw.url ?? skippedTrack.url})**` +
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
                logger.debug('Interaction response timed out.');
                return;
            }

            logger.error(error, 'Unhandled error while awaiting or handling component interaction.');
            return;
        }
    }
};
