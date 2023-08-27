import { Events } from 'discord.js';
import { v4 as uuidv4 } from 'uuid';

import loggerModule from '../../services/logger';

module.exports = {
    name: Events.Debug,
    isDebug: true,
    once: false,
    execute: async (message: string) => {
        const executionId = uuidv4();
        const logger = loggerModule.child({
            source: 'debug.js',
            module: 'event',
            name: 'clientDebug',
            executionId: executionId
        });

        logger.debug(message);
    }
};
