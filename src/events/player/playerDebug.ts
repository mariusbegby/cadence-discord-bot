import { v4 as uuidv4 } from 'uuid';

import loggerModule from '../../services/logger';

module.exports = {
    name: 'error',
    isDebug: true,
    isPlayerEvent: true,
    execute: async (message: string) => {
        const executionId = uuidv4();
        const logger = loggerModule.child({
            source: 'playerDebug.js',
            module: 'event',
            name: 'playerDebug',
            executionId: executionId
        });

        logger.trace(message);
    }
};
