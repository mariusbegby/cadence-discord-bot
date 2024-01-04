import { LyricsData, lyricsExtractor } from '@discord-player/extractor';
import { Player, SearchResult, useMainPlayer } from 'discord-player';
import { ApplicationCommandOptionChoiceData } from 'discord.js';
import { Logger } from 'pino';
import { BaseAutocompleteInteraction } from '../../classes/interactions';
import { getTrackName, isQueryTooShort, shouldUseLastQuery } from '../../common/autocompleteUtils';
import { BaseAutocompleteParams, BaseAutocompleteReturnType, RecentQuery } from '../../types/interactionTypes';
import { TFunction } from 'i18next';
import { useUserTranslator } from '../../common/localeUtil';

class LyricsAutocomplete extends BaseAutocompleteInteraction {
    private recentQueries = new Map<string, RecentQuery>();

    constructor() {
        super('lyrics');
    }

    async execute({ executionId, interaction }: BaseAutocompleteParams): BaseAutocompleteReturnType {
        const logger = this.getLogger(this.name, executionId, interaction);
        const translator = useUserTranslator(interaction);

        const query: string = interaction.options.getString('query', true);
        const { lastQuery, result, timestamp } = this.recentQueries.get(interaction.user.id) || {};

        if (shouldUseLastQuery(query, lastQuery, timestamp)) {
            logger.debug(`Responding with results from lastQuery for query '${query}'`);
            return interaction.respond(result as ApplicationCommandOptionChoiceData<string | number>[]);
        }

        if (isQueryTooShort(query)) {
            logger.debug(`Responding with empty results due to < 3 length for query '${query}'`);
            return interaction.respond([]);
        }

        const autocompleteChoices = await this.getAutocompleteChoices(query, logger, translator);

        if (!autocompleteChoices || autocompleteChoices.length === 0) {
            logger.debug(`Responding with empty results for query '${query}'`);
            return interaction.respond([]);
        }

        this.updateRecentQuery(interaction.user.id, query, autocompleteChoices);

        logger.debug(`Responding to autocomplete with results for query: '${query}'.`);
        return interaction.respond(autocompleteChoices);
    }

    private async getAutocompleteChoices(
        query: string,
        logger: Logger,
        translator: TFunction
    ): Promise<ApplicationCommandOptionChoiceData<string>[]> {
        const lyricsResult: LyricsData | null = await this.searchLyrics(query, logger);

        if (!lyricsResult) {
            return this.getAutocompleteChoicesFallback(query, logger, translator);
        } else {
            return this.getAutocompleteChoicesFromLyricsResult(lyricsResult, translator);
        }
    }

    private async searchLyrics(query: string, logger: Logger): Promise<LyricsData | null> {
        try {
            const genius = lyricsExtractor();
            return (await genius.search(query)) as LyricsData;
        } catch (error) {
            logger.warn(`Failed to fetch lyrics from Genius for query '${query}': ${error}`);
            return null;
        }
    }

    private async getAutocompleteChoicesFallback(
        query: string,
        logger: Logger,
        translator: TFunction
    ): Promise<ApplicationCommandOptionChoiceData<string>[]> {
        logger.debug(`No Genius lyrics found for query '${query}', using player.search() as fallback.`);

        const player: Player = useMainPlayer()!;
        const searchResults: SearchResult = await player.search(query);

        return searchResults.tracks.slice(0, 1).map((track) => ({
            name: getTrackName(track, translator),
            value: track.title.slice(0, 100)
        }));
    }

    private getAutocompleteChoicesFromLyricsResult(
        lyricsResult: LyricsData,
        translator: TFunction
    ): ApplicationCommandOptionChoiceData<string>[] {
        return [
            {
                name: this.getLyricsResultName(lyricsResult, translator),
                value: lyricsResult.title.slice(0, 100)
            }
        ];
    }

    private getLyricsResultName(lyricsResult: LyricsData, translator: TFunction): string {
        return translator('commands.lyrics.autocompleteSearchResult', {
            title: lyricsResult.title,
            artist: lyricsResult.artist.name
        });
    }

    private updateRecentQuery(
        userId: string,
        query: string,
        result: ApplicationCommandOptionChoiceData<string>[]
    ): void {
        this.recentQueries.set(userId, {
            lastQuery: query,
            result,
            timestamp: Date.now()
        });
    }
}

export default new LyricsAutocomplete();
