const logger = require('../../services/logger');

exports.transformQuery = async (query) => {
    if (query.startsWith('https://open.spotify.com/')) {
        try {
            // regex to check for country-based Spotify url
            const regex = new RegExp(
                'https://open.spotify.com/((?:[a-z]{2,4}-[a-z]{2,4}/)|(?:[a-z]{2,4}/))?track/([a-zA-Z0-9]+)'
            );
            const isCountryBased = regex.test(query);

            // if country-based, transform to normal Spotify url
            if (isCountryBased) {
                logger.debug(`Transforming country-based Spotify url to normal Spotify url from query ${query}.`);
                const trackId = query.match(regex)[2];
                query = `https://open.spotify.com/track/${trackId}`;
            }
        } catch (error) {
            logger.error(error);
        }
    }

    return query;
};
