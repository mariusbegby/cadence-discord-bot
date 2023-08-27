import loggerModule from '../../services/logger';
import { GetUptimeFormattedParams } from '../../types/utilTypes';

export const getUptimeFormatted = async ({ executionId }: GetUptimeFormattedParams) => {
    const logger = loggerModule.child({
        source: 'getUptimeFormatted.js',
        module: 'utilSystem',
        name: 'getUptimeFormatted',
        executionId: executionId
    });

    try {
        let uptimeFormattedString = '';

        const uptimeInSeconds = parseFloat(process.uptime().toFixed(0));
        const uptimeDate = new Date(0);
        uptimeDate.setSeconds(uptimeInSeconds);
        uptimeFormattedString = `${
            uptimeDate.getUTCDate() - 1
        }d ${uptimeDate.getUTCHours()}h ${uptimeDate.getUTCMinutes()}m ${uptimeDate.getUTCSeconds()}s`;

        return uptimeFormattedString;
    } catch (error) {
        logger.error('Error retrieving or transforming uptime to formatted string.', error);
        throw error;
    }
};
