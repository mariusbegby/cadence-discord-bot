import { randomUUID as uuidv4 } from 'node:crypto';
import { Logger } from 'pino';
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
