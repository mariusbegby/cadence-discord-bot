import { LyricsData, lyricsExtractor } from '@discord-player/extractor';
import { Player, SearchResult, useMainPlayer } from 'discord-player';
import { ApplicationCommandOptionChoiceData } from 'discord.js';
import { Logger } from '../../common/services/logger';
import { BaseAutocompleteInteraction } from '../../common/classes/interactions';
import { getTrackName, isQueryTooShort, shouldUseLastQuery } from '../../common/utils/autocompleteUtils';
import { BaseAutocompleteParams, BaseAutocompleteReturnType, RecentQuery } from '../../types/interactionTypes';
import { useUserTranslator, Translator } from '../../common/utils/localeUtil';
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
        translator: Translator
    ): Promise<ApplicationCommandOptionChoiceData<string>[]> {
        const genius = lyricsExtractor();
        const lyricsResult: LyricsData = (await genius.search(query).catch(() => null)) as LyricsData;

        if (!lyricsResult) {
            return this.getAutocompleteChoicesFallback(query, logger, translator);
        } else {
            return this.getAutocompleteChoicesFromLyricsResult(lyricsResult, translator);
        }
    }

    private async getAutocompleteChoicesFallback(
        query: string,
        logger: Logger,
        translator: Translator
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
        translator: Translator
    ): ApplicationCommandOptionChoiceData<string>[] {
        return [
            {
                name: this.getLyricsResultName(lyricsResult, translator),
                value: lyricsResult.title.slice(0, 100)
            }
        ];
    }

    private getLyricsResultName(lyricsResult: LyricsData, translator: Translator): string {
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
            result: result,
            timestamp: Date.now()
        });
    }
}

export default new LyricsAutocomplete();
