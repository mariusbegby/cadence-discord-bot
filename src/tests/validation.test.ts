import { transformQuery } from '../utils/validation/searchQueryValidator';

describe('searchQueryValidator', () => {
    it.each(['us', 'nb', 'intl', 'en-us', 'long-code'])(
        'should transform country-based Spotify url to normal Spotify url',
        async (countryCode) => {
            const trackId = '5T8EDUDqKcs6OSOwEsfqG7';
            const query: string = `https://open.spotify.com/${countryCode}/track/${trackId}`;
            const transformedQuery: string = transformQuery({ query, executionId: 'test' });

            expect(transformedQuery).toBe(`https://open.spotify.com/track/${trackId}`);
        }
    );

    it.each(['a', 'abcde', 'looooong', 'a-b', 'abcde-abcde'])(
        'should not transform Spotify url without matching country-code patterh to normal Spotify url',
        async (path) => {
            const trackId = '5T8EDUDqKcs6OSOwEsfqG7';
            const query: string = `https://open.spotify.com/${path}/track/${trackId}`;
            const transformedQuery: string = transformQuery({ query, executionId: 'test' });

            expect(transformedQuery).toBe(`https://open.spotify.com/${path}/track/${trackId}`);
        }
    );

    it.each(['1', '12', '123', '1234', '12345'])(
        'should not transform Spotify url with numbers as path to normal Spotify url',
        async (path) => {
            const trackId = '5T8EDUDqKcs6OSOwEsfqG7';
            const query: string = `https://open.spotify.com/${path}/track/${trackId}`;
            const transformedQuery: string = transformQuery({ query, executionId: 'test' });

            expect(transformedQuery).toBe(`https://open.spotify.com/${path}/track/${trackId}`);
        }
    );

    it.each([
        ['https://google.com', 'https://google.com'],
        [
            'https://open.spotify.comus/track/5T8EDUDqKcs6OSOwEsfqG7',
            'https://open.spotify.comus/track/5T8EDUDqKcs6OSOwEsfqG7'
        ],
        [
            'https://open.spotify.com/ustrack/5T8EDUDqKcs6OSOwEsfqG7',
            'https://open.spotify.com/ustrack/5T8EDUDqKcs6OSOwEsfqG7'
        ]
    ])('should return the same url if it is not a valid Spotify url', async (inputUrl, expectedUrl) => {
        const executionId: string = 'test';
        const transformedQuery: string = transformQuery({ query: inputUrl, executionId });

        expect(transformedQuery).toBe(expectedUrl);
    });
});
