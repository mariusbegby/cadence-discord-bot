import { randomUUID as uuidv4 } from 'node:crypto';
import { loggerService, Logger } from '../../common/services/logger';

module.exports = {
    name: 'uncaughtException',
    isDebug: false,
    execute: async (error: Error) => {
        const executionId: string = uuidv4();
        const logger: Logger = loggerService.child({
            module: 'event',
            name: 'uncaughtException',
            executionId: executionId
        });

        logger.fatal(error, 'UNCAUGHT EXCEPTION ERROR:');
        return;
    }
};
