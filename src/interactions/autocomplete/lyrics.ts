import { useMainPlayer } from 'discord-player';
import loggerModule from '../../services/logger';
import { CustomAutocompleteInteraction } from '../../types/interactionTypes';
import { lyricsExtractor } from '@discord-player/extractor';

const loggerTemplate = loggerModule.child({
    source: 'lyrics.js',
    module: 'autocompleteInteraction',
    name: '/lyrics'
});

const recentQueries = new Map();

const autocomplete: CustomAutocompleteInteraction = {
    execute: async ({ interaction, executionId }) => {
        // TODO: Extract autocomplete logic
        const logger = loggerTemplate.child({
            executionId: executionId,
            shardId: interaction.guild?.shardId,
            guildId: interaction.guild?.id
        });

        const query = interaction.options.getString('query', true);

        const { lastQuery, result, timestamp } = recentQueries.get(interaction.user.id) || {};

        if (lastQuery && (query.startsWith(lastQuery) || lastQuery.startsWith(query)) && Date.now() - timestamp < 500) {
            logger.debug(`Responding with results from lastQuery for query '${query}'`);
            return interaction.respond(result);
        }

        if (query.length < 3) {
            logger.debug(`Responding with empty results due to < 3 length for query '${query}'`);
            return interaction.respond([]);
        }

        const genius = lyricsExtractor();
        const lyricsResult = await genius.search(query).catch(() => null);
        let response = [];

        if (!lyricsResult) {
            logger.debug(`No Genius lyrics found for query '${query}', using player.search() as fallback.`);
            const player = useMainPlayer()!;
            const searchResults = await player.search(query);
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
