import { randomUUID as uuidv4 } from 'node:crypto';
import { loggerService, Logger } from '../../common/services/logger';

module.exports = {
    name: 'error',
    isDebug: true,
    isPlayerEvent: true,
    execute: async (message: string) => {
        const executionId: string = uuidv4();
        const logger: Logger = loggerService.child({
            module: 'event',
            name: 'playerDebug',
            executionId: executionId
        });

        logger.trace(message);
    }
};
