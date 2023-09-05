import { Logger } from 'pino';
import { randomUUID as uuidv4 } from 'node:crypto';
import loggerModule from '../../services/logger';

module.exports = {
    name: 'uncaughtException',
    isDebug: false,
    execute: async (error: Error) => {
        const executionId: string = uuidv4();
        const logger: Logger = loggerModule.child({
            module: 'event',
            name: 'uncaughtException',
            executionId: executionId
        });

        logger.fatal(error, 'UNCAUGHT EXCEPTION ERROR:');
        return;
    }
};
