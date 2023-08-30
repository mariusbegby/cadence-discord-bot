import { LyricsData, lyricsExtractor } from '@discord-player/extractor';
import { Player, SearchResult, useMainPlayer } from 'discord-player';
import { ApplicationCommandOptionChoiceData } from 'discord.js';
import { Logger } from 'pino';
import loggerModule from '../../services/logger';
import { CustomAutocompleteInteraction } from '../../types/interactionTypes';

const loggerTemplate: Logger = loggerModule.child({
    source: 'lyrics.js',
    module: 'autocompleteInteraction',
    name: '/lyrics'
});

// TODO: create interface for recent query object
const recentQueries = new Map();

const autocomplete: CustomAutocompleteInteraction = {
    execute: async ({ interaction, executionId }) => {
        const logger: Logger = loggerTemplate.child({
            executionId: executionId,
            shardId: interaction.guild?.shardId,
            guildId: interaction.guild?.id
        });

        const query: string = interaction.options.getString('query', true);

        const { lastQuery, result, timestamp } = recentQueries.get(interaction.user.id);

        if (lastQuery && (query.startsWith(lastQuery) || lastQuery.startsWith(query)) && Date.now() - timestamp < 500) {
            logger.debug(`Responding with results from lastQuery for query '${query}'`);
            return interaction.respond(result);
        }

        if (query.length < 3) {
            logger.debug(`Responding with empty results due to < 3 length for query '${query}'`);
            return interaction.respond([]);
        }

        const genius = lyricsExtractor();
        const lyricsResult: LyricsData = (await genius.search(query).catch(() => null)) as LyricsData;
        // TODO: Update TS Type for lyricsResult and create response object interface
        let response: ApplicationCommandOptionChoiceData<string>[] = [];

        if (!lyricsResult) {
            logger.debug(`No Genius lyrics found for query '${query}', using player.search() as fallback.`);
            const player: Player = useMainPlayer()!;
            const searchResults: SearchResult = await player.search(query);
            response = searchResults.tracks.slice(0, 1).map((track) => ({
                name:
                    `${track.title} [Artist: ${track.author}]`.length > 100
                        ? `${track.title}`.slice(0, 100)
                        : `${track.title} [Artist: ${track.author}]`,
                value: track.title.slice(0, 100)
            }));
        } else {
            logger.debug(`Found Genius lyrics for query '${query}'.`);
            response = [
                {
                    name: `${lyricsResult.title} [Artist: ${lyricsResult.artist.name}]`.slice(0, 100),
                    value: lyricsResult.title.slice(0, 100)
                }
            ];
        }

        if (!response || response.length === 0) {
            logger.debug(`Responding with empty results for query '${query}'`);
            return interaction.respond([]);
        }

        recentQueries.set(interaction.user.id, {
            lastQuery: query,
            result: response,
            timestamp: Date.now()
        });

        logger.debug(`Responding to autocomplete with results for query: '${query}'.`);
        return interaction.respond(response);
    }
};

export default autocomplete;
