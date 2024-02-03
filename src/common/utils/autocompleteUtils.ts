import { Track } from 'discord-player';
import { TFunction } from 'i18next';

export function shouldUseLastQuery(query: string, lastQuery?: string, timestamp?: number): boolean {
    return Boolean(
        lastQuery && (query.startsWith(lastQuery) || lastQuery.startsWith(query)) && Date.now() - (timestamp ?? 0) < 500
    );
}

export function isQueryTooShort(query: string): boolean {
    return query.length < 3;
}

export function getTrackName(track: Track, translator: TFunction): string {
    const name = translator('autocomplete.trackName', {
        title: track.title,
        author: track.author
    });
    return name.length > 100 ? name.slice(0, 100) : name;
}
