import { v4 as uuidv4 } from 'uuid';
import loggerModule from '../../services/logger';

module.exports = {
    name: 'uncaughtException',
    isDebug: false,
    execute: async (error) => {
        const executionId = uuidv4();
        const logger = loggerModule.child({
            source: 'uncaughtException.js',
            module: 'event',
            name: 'uncaughtException',
            executionId: executionId
        });

        logger.fatal(error, 'UNCAUGHT EXCEPTION ERROR:');
        return;
    }
};
