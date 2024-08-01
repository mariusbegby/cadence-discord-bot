import { loggerService, type Logger } from '../services/logger';
import type { TransformQueryParams } from '../../types/utilTypes';

const isCountryBasedRegex: RegExp =
    /https:\/\/open.spotify.com\/((?:[a-z]{2,4}-[a-z]{2,4}\/)|(?:[a-z]{2,4}\/))(track|playlist)\/([a-zA-Z0-9]+)/;
const getTrackIdRegex: RegExp = /https:\/\/open.spotify.com\/track\/([a-zA-Z0-9]+)/;

export const transformQuery = ({ query, executionId }: TransformQueryParams) => {
    const logger: Logger = loggerService.child({
        module: 'utilValidation',
        name: 'transformQuery',
        executionId: executionId
    });

    if (query.startsWith('https://open.spotify.com/')) {
        try {
            // regex to check for country-based Spotify url
            const isCountryBased: boolean = isCountryBasedRegex.test(query);

            // if country-based, transform to normal Spotify url
            if (isCountryBased) {
                logger.debug(`Transforming country-based Spotify url to normal Spotify url from query '${query}'.`);
                const matches: RegExpMatchArray | null = query.match(isCountryBasedRegex);
                if (matches) {
                    const type: string = matches[2];
                    const trackId: string = matches[3];
                    query = `https://open.spotify.com/${type}/${trackId}`;
                }
            }

            // if /track/id is in url TWICE, remove the second one, e.g. https://open.spotify.com/track/123/track/123
            const trackIdMatches: RegExpMatchArray | null = query.match(getTrackIdRegex);
            if (trackIdMatches) {
                logger.debug(`Transforming Spotify url to remove duplicate track id from query '${query}'.`);
                const trackId: string = trackIdMatches[1];
                query = `https://open.spotify.com/track/${trackId}`;
            }
        } catch (error) {
            logger.error(error, 'Error while validating or transforming Spotify url.');
        }
    }

    return query;
};
