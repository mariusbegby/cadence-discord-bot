import { Logger } from 'pino';
import { v4 as uuidv4 } from 'uuid';
import loggerModule from '../../services/logger';

module.exports = {
    name: 'unhandledRejection',
    isDebug: false,
    execute: async (error: Error) => {
        const executionId: string = uuidv4();
        const logger: Logger = loggerModule.child({
            source: 'unhandledRejection.js',
            module: 'event',
            name: 'unhandledRejection',
            executionId: executionId
        });

        logger.fatal(error, 'UNHANDLED REJECTION ERROR:');
        return;
    }
};
