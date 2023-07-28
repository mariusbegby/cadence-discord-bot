const logger = require('../../services/logger');
const { embedOptions } = require('../../config');
const { notInVoiceChannel, notInSameVoiceChannel } = require('../../utils/validation/voiceChannelValidator');
const { queueDoesNotExist, queueNoCurrentTrack } = require('../../utils/validation/queueValidator');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer, useQueue, QueryType } = require('discord-player');
const { lyricsExtractor } = require('@discord-player/extractor');

module.exports = {
    isNew: true,
    isBeta: false,
    data: new SlashCommandBuilder()
        .setName('lyrics')
        .setDescription('Get lyrics from Genius for current or specified track.')
        .setDMPermission(false)
        .setNSFW(false)
        .addStringOption((option) =>
            option
                .setName('query')
                .setDescription('Search query or URL.')
                .setRequired(false)
                .setMinLength(2)
                .setMaxLength(500)
                .setAutocomplete(true)
        ),
    autocomplete: async ({ interaction }) => {
        const query = interaction.options.getString('query', true);
        if (query.length < 2) {
            return;
        }
        const genius = lyricsExtractor();
        const lyricsResult = await genius.search(query).catch(() => null);

        let response = [];

        if (!lyricsResult) {
            const player = useMainPlayer();
            const searchResults = await player.search(query);
            response = searchResults.tracks.slice(0, 1).map((track) => ({
                name:
                    `${track.title} [Artist: ${track.author}]`.length > 100
                        ? `${track.title}`.slice(0, 100)
                        : `${track.title} [Author: ${track.author}]`,
                value: track.title.slice(0, 100)
            }));
        } else {
            response = [
                {
                    name: `${lyricsResult.title} [Artist: ${lyricsResult.artist.name}]`.slice(0, 100),
                    value: lyricsResult.title.slice(0, 100)
                }
            ];
        }

        if (!response || response.length === 0) {
            return interaction.respond([]);
        }

        logger.debug(`[Shard ${interaction.guild.shardId}] Autocomplete search responded for query: ${query}`);
        return interaction.respond(response);
    },
    execute: async ({ interaction }) => {
        const query = interaction.options.getString('query');
        const queue = useQueue(interaction.guild.id);
        let geniusSearchQuery = '';

        if (!query) {
            if (await notInVoiceChannel(interaction)) {
                return;
            }

            if (await queueDoesNotExist(interaction, queue)) {
                return;
            }

            if (await notInSameVoiceChannel(interaction, queue)) {
                return;
            }

            if (await queueNoCurrentTrack(interaction, queue)) {
                return;
            }
            geniusSearchQuery = queue.currentTrack.title.slice(0, 50);
        }

        let searchResult;
        if (query) {
            const player = useMainPlayer();
            const searchResults = await player.search(query, {
                searchEngine: QueryType.SPOTIFY_SEARCH
            });

            if (searchResults.tracks.length === 0) {
                logger.debug(
                    `[Shard ${interaction.guild.shardId}] User used command ${interaction.commandName} but there was no search results found.`
                );
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(
                                `**${embedOptions.icons.warning} No search results found**\nThere was no search results found for query **${query}**.`
                            )
                            .setColor(embedOptions.colors.warning)
                    ]
                });
            }

            searchResult = searchResults.tracks[0];
            geniusSearchQuery = searchResults.tracks[0].title;
            logger.debug(`Using query for genius: ${geniusSearchQuery}`);
        }

        // get lyrics
        const genius = lyricsExtractor();
        let lyricsResult = await genius.search(geniusSearchQuery).catch(() => null);

        // try again with shorter query (some titles just have added info in the end)
        if (!lyricsResult && geniusSearchQuery.length > 20) {
            lyricsResult = await genius.search(geniusSearchQuery.slice(0, 20)).catch(() => null);
        }
        if (!lyricsResult && geniusSearchQuery.length > 10) {
            lyricsResult = await genius.search(geniusSearchQuery.slice(0, 10)).catch(() => null);
        }

        // Check if authors in track from searchResult includes the artist name from genius
        if (searchResult && lyricsResult) {
            const searchResultAuthorIncludesArtist = searchResult.author
                .toLowerCase()
                .includes(lyricsResult.artist.name.toLowerCase());
            const lyricsResultArtistIncludesAuthor = lyricsResult.artist.name
                .toLowerCase()
                .includes(searchResult.author.toLowerCase());
            const searchResultAuthorSplitIncludesArtist = lyricsResult.artist.name
                .toLowerCase()
                .includes(searchResult.author.split(', ')[0].toLowerCase());

            if (
                !searchResultAuthorIncludesArtist &&
                !lyricsResultArtistIncludesAuthor &&
                !searchResultAuthorSplitIncludesArtist
            ) {
                lyricsResult = null;
                logger.debug('Found lyrics but artist name did not match from player result.');
            }
        }

        if (!lyricsResult || !lyricsResult.lyrics) {
            logger.debug(
                `[Shard ${interaction.guild.shardId}] User used command ${interaction.commandName} but there was no lyrics found.`
            );
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${embedOptions.icons.warning} No lyrics found**\nThere was no Genius lyrics found for track **${geniusSearchQuery}**.`
                        )
                        .setColor(embedOptions.colors.warning)
                ]
            });
        }

        // If message length is too long, split into multiple messages
        if (lyricsResult.lyrics.length > 3800) {
            logger.debug(`[Shard ${interaction.guild.shardId}] Lyrics too long, splitting into multiple messages.`);
            const messageCount = Math.ceil(lyricsResult.lyrics.length / 3800);
            for (let i = 0; i < messageCount; i++) {
                logger.debuf(
                    `[Shard ${interaction.guild.shardId}] Lyrics, sending message ${i + 1} of ${messageCount}.`
                );
                const message = lyricsResult.lyrics.slice(i * 3800, (i + 1) * 3800);
                if (i === 0) {
                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(
                                    `**${embedOptions.icons.queue} Showing lyrics**\n` +
                                        `**Track: [${lyricsResult.title}](${lyricsResult.url})**\n` +
                                        `**Artist: [${lyricsResult.artist.name}](${lyricsResult.artist.url})**` +
                                        `\n\n\`\`\`fix\n${message}\`\`\``
                                )
                                .setColor(embedOptions.colors.info)
                        ]
                    });
                    continue;
                } else {
                    await interaction.channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(`\`\`\`fix\n${message}\`\`\``)
                                .setColor(embedOptions.colors.info)
                        ]
                    });
                }
            }

            return;
        }

        logger.debug(
            `[Shard ${interaction.guild.shardId}] User used command ${interaction.commandName} and retrieved lyrics.`
        );

        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${embedOptions.icons.queue} Showing lyrics**\n` +
                            `**Track: [${lyricsResult.title}](${lyricsResult.url})**\n` +
                            `**Artist: [${lyricsResult.artist.name}](${lyricsResult.artist.url})**` +
                            `\n\n\`\`\`fix\n${lyricsResult.lyrics}\`\`\``
                    )
                    .setColor(embedOptions.colors.info)
            ]
        });
    }
};
