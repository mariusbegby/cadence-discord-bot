import { randomUUID as uuidv4 } from 'node:crypto';
import { Logger } from 'pino';
import loggerModule from '../../services/logger';

module.exports = {
    name: 'unhandledRejection',
    isDebug: false,
    execute: async (error: Error) => {
        const executionId: string = uuidv4();
        const logger: Logger = loggerModule.child({
            module: 'event',
            name: 'unhandledRejection',
            executionId: executionId
        });

        logger.fatal(error, 'UNHANDLED REJECTION ERROR:');
        return;
    }
};
