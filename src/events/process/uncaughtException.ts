import { Logger } from 'pino';
import { v4 as uuidv4 } from 'uuid';
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
