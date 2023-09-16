import { Logger } from 'pino';
import loggerModule from '../../services/logger';
import { GetUptimeFormattedParams } from '../../types/utilTypes';
import { formatDuration } from '../../common/formattingUtils';

export const getUptimeFormatted = ({ executionId }: GetUptimeFormattedParams): string => {
    const logger: Logger = loggerModule.child({
        module: 'utilSystem',
        name: 'getUptimeFormatted',
        executionId: executionId
    });

    try {
        const uptimeInSeconds: number = parseFloat(process.uptime().toFixed(0));
        return formatDuration(uptimeInSeconds * 1000);
    } catch (error) {
        logger.error('Error retrieving or transforming uptime to formatted string.', error);
        throw error;
    }
};
