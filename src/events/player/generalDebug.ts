import { randomUUID as uuidv4 } from 'node:crypto';
import { Logger } from 'pino';
import loggerModule from '../../services/logger';

module.exports = {
    name: 'debug',
    isDebug: true,
    isPlayerEvent: false,
    execute: async (message: string) => {
        const executionId: string = uuidv4();
        const logger: Logger = loggerModule.child({
            module: 'event',
            name: 'playerGeneralDebug',
            executionId: executionId
        });

        logger.debug(message);
    }
};
