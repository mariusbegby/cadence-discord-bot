import { LyricsData, lyricsExtractor } from '@discord-player/extractor';
import { GuildQueue, Player, QueryType, useMainPlayer, useQueue } from 'discord-player';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../../types/interactionTypes';
import { BaseSlashCommandInteraction } from '../../../classes/interactions';
import { checkQueueExists, checkQueueCurrentTrack } from '../../../utils/validation/queueValidator';
import { checkSameVoiceChannel, checkInVoiceChannel } from '../../../utils/validation/voiceChannelValidator';

class LyricsCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = new SlashCommandBuilder()
            .setName('lyrics')
            .setDescription('Search Genius lyrics for current or specified track.')
            .addStringOption((option) =>
                option
                    .setName('query')
                    .setDescription('Search query by text or URL.')
                    .setRequired(false)
                    .setMinLength(2)
                    .setMaxLength(500)
                    .setAutocomplete(true)
            );
        super(data);

        this.validators = [
            (args) => checkInVoiceChannel(args),
            (args) => checkSameVoiceChannel(args),
            (args) => checkQueueExists(args),
            (args) => checkQueueCurrentTrack(args)
        ];
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, interaction } = params;
        const logger = this.getLogger(this.name, executionId, interaction);

        const queue: GuildQueue = useQueue(interaction.guild!.id)!;

        const query: string = interaction.options.getString('query')!;
        let geniusSearchQuery: string = '';

        if (!query) {
            await this.runValidators({ interaction, queue, executionId });

            geniusSearchQuery = queue.currentTrack!.title.slice(0, 50);

            logger.debug(
                `No input query provided, using current track. Using query for genius: '${geniusSearchQuery}'`
            );
        }

        let searchResult;
        if (query) {
            logger.debug(`Query input provided, using query '${query}' for player.search().`);
            const player: Player = useMainPlayer()!;
            const searchResults = await player.search(query, {
                searchEngine: QueryType.SPOTIFY_SEARCH
            });

            if (searchResults.tracks.length === 0) {
                logger.debug('No search results using player.search() found.');

                logger.debug('Responding with warning embed.');
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(
                                `**${this.embedOptions.icons.warning} No search results found**\nThere was no search results found for query **${query}**.`
                            )
                            .setColor(this.embedOptions.colors.warning)
                    ]
                });
            }

            searchResult = searchResults.tracks[0];
            geniusSearchQuery = searchResults.tracks[0].title;
            logger.debug(`Using query for genius: '${geniusSearchQuery}'`);
        }

        // get lyrics
        const genius = lyricsExtractor();
        let lyricsResult: LyricsData | null = await genius.search(geniusSearchQuery).catch(() => null);

        // try again with shorter query (some titles just have added info in the end)
        if (!lyricsResult && geniusSearchQuery.length > 20) {
            logger.debug(
                `No Genius lyrics found for query '${geniusSearchQuery}', trying again with shorter query (20 chars).`
            );
            lyricsResult = await genius.search(geniusSearchQuery.slice(0, 20)).catch(() => null);
        }
        if (!lyricsResult && geniusSearchQuery.length > 10) {
            logger.debug(
                `No Genius lyrics found for query '${geniusSearchQuery}', trying again with shorter query (10 chars).`
            );
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
                logger.debug('Found Genius lyrics but artist name did not match from player.search() result.');
            }
        }

        if (!lyricsResult || !lyricsResult.lyrics) {
            logger.debug('No matching lyrics found.');

            logger.debug('Responding with warning embed.');
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${this.embedOptions.icons.warning} No lyrics found**\nThere was no Genius lyrics found for track **${geniusSearchQuery}**.`
                        )
                        .setColor(this.embedOptions.colors.warning)
                ]
            });
        }

        logger.debug(`Successfully found matching Genius lyrics for query '${geniusSearchQuery}'.`);

        // If message length is too long, split into multiple messages
        if (lyricsResult.lyrics.length > 3800) {
            logger.debug('Lyrics text too long, splitting into multiple messages.');
            const messageCount: number = Math.ceil(lyricsResult.lyrics.length / 3800);
            for (let i: number = 0; i < messageCount; i++) {
                logger.debug(`Lyrics, sending message ${i + 1} of ${messageCount}.`);
                const message: string = lyricsResult.lyrics.slice(i * 3800, (i + 1) * 3800);
                if (i === 0) {
                    logger.debug('Responding with info embed for first message with lyrics.');
                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(
                                    `**${this.embedOptions.icons.queue} Showing lyrics**\n` +
                                        `**Track: [${lyricsResult.title}](${lyricsResult.url})**\n` +
                                        `**Artist: [${lyricsResult.artist.name}](${lyricsResult.artist.url})**` +
                                        `\n\n\`\`\`fix\n${message}\`\`\``
                                )
                                .setColor(this.embedOptions.colors.info)
                        ]
                    });
                    continue;
                } else {
                    logger.debug('Sending consecutive message with lyrics.');
                    await interaction.channel!.send({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(`\`\`\`fix\n${message}\`\`\``)
                                .setColor(this.embedOptions.colors.info)
                        ]
                    });
                }
            }

            return;
        }

        logger.debug('Responding with info embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${this.embedOptions.icons.queue} Showing lyrics**\n` +
                            `**Track: [${lyricsResult.title}](${lyricsResult.url})**\n` +
                            `**Artist: [${lyricsResult.artist.name}](${lyricsResult.artist.url})**` +
                            `\n\n\`\`\`fix\n${lyricsResult.lyrics}\`\`\``
                    )
                    .setColor(this.embedOptions.colors.info)
            ]
        });
    }
}

export default new LyricsCommand();
