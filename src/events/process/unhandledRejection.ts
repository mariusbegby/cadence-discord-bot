import { randomUUID as uuidv4 } from 'node:crypto';
import { loggerService, type Logger } from '../../common/services/logger';

module.exports = {
    name: 'unhandledRejection',
    isDebug: false,
    execute: async (error: Error) => {
        const executionId: string = uuidv4();
        const logger: Logger = loggerService.child({
            module: 'event',
            name: 'unhandledRejection',
            executionId: executionId
        });

        logger.fatal(error, 'UNHANDLED REJECTION ERROR:');
        return;
    }
};
