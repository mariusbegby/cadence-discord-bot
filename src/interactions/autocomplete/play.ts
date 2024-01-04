import { Player, SearchResult, useMainPlayer } from 'discord-player';
import { ApplicationCommandOptionChoiceData } from 'discord.js';
import { BaseAutocompleteInteraction } from '../../classes/interactions';
import { getTrackName, isQueryTooShort, shouldUseLastQuery } from '../../common/autocompleteUtils';
import { BaseAutocompleteParams, BaseAutocompleteReturnType, RecentQuery } from '../../types/interactionTypes';
import { TFunction } from 'i18next';
import { useUserTranslator } from '../../common/localeUtil';

class PlayAutocomplete extends BaseAutocompleteInteraction {
    private recentQueries = new Map<string, RecentQuery>();

    constructor() {
        super('play');
    }

    async execute(params: BaseAutocompleteParams): BaseAutocompleteReturnType {
        const { executionId, interaction } = params;
        const logger = this.getLogger(this.name, executionId, interaction);
        const translator = useUserTranslator(interaction);

        const query: string = interaction.options.getString('query', true);

        const { lastQuery, result, timestamp } = this.recentQueries.get(interaction.user.id) || {};

        if (shouldUseLastQuery(query, lastQuery, timestamp)) {
            logger.debug(`Responding with results from lastQuery for query '${query}'`);
            return await interaction.respond(result as ApplicationCommandOptionChoiceData<string | number>[]);
        }

        if (isQueryTooShort(query)) {
            logger.debug(`Responding with empty results due to < 3 length for query '${query}'`);
            return await interaction.respond([]) ;
        }

        const autocompleteChoices = await this.getAutocompleteChoices(query, translator);

        if (!autocompleteChoices || autocompleteChoices.length === 0) {
            logger.debug(`Responding with empty results for query '${query}'`);
            return await interaction.respond([]);
        }

        this.updateRecentQuery(interaction.user.id, query, autocompleteChoices);

        logger.debug(`Responding to autocomplete with results for query: '${query}'.`);
        return await interaction.respond(autocompleteChoices);
    }

    private async getAutocompleteChoices(
        query: string,
        translator: TFunction
    ): Promise<ApplicationCommandOptionChoiceData<string>[]> {
        const player: Player = useMainPlayer()!;
        const searchResults: SearchResult = await player.search(query);
        return searchResults.tracks.slice(0, 5).map((track) => ({
            name: getTrackName(track, translator),
            value: track.url
        }));
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

export default new PlayAutocomplete();
