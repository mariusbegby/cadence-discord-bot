import type { Track } from 'discord-player';
import type { Translator } from './localeUtil';

export function shouldUseLastQuery(query: string, lastQuery?: string, timestamp?: number): boolean {
    return Boolean(
        lastQuery && (query.startsWith(lastQuery) || lastQuery.startsWith(query)) && Date.now() - (timestamp ?? 0) < 500
    );
}

export function isQueryTooShort(query: string): boolean {
    return query.length < 4;
}

export function getTrackName(track: Track, translator: Translator): string {
    const name = translator('autocomplete.trackName', {
        title: track.title,
        author: track.author
    });
    return name.length > 100 ? name.slice(0, 100) : name;
}
