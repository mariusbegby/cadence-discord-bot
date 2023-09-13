import { Track } from 'discord-player';

export function shouldUseLastQuery(query: string, lastQuery?: string, timestamp?: number): boolean {
    return Boolean(
        lastQuery && (query.startsWith(lastQuery) || lastQuery.startsWith(query)) && Date.now() - (timestamp ?? 0) < 500
    );
}

export function isQueryTooShort(query: string): boolean {
    return query.length < 3;
}

export function getTrackName(track: Track): string {
    const name = `${track.title} [Author: ${track.author}]`;
    return name.length > 100 ? name.slice(0, 100) : name;
}
