import { Logger } from 'pino';
import { v4 as uuidv4 } from 'uuid';
import loggerModule from '../../services/logger';

module.exports = {
    name: 'error',
    isDebug: true,
    isPlayerEvent: true,
    execute: async (message: string) => {
        const executionId: string = uuidv4();
        const logger: Logger = loggerModule.child({
            module: 'event',
            name: 'playerDebug',
            executionId: executionId
        });

        logger.trace(message);
    }
};
