import { Events } from 'discord.js';
import { randomUUID as uuidv4 } from 'node:crypto';

import loggerModule from '../../services/logger';
import { Logger } from 'pino';

module.exports = {
    name: Events.Debug,
    isDebug: true,
    once: false,
    execute: async (message: string) => {
        const executionId: string = uuidv4();
        const logger: Logger = loggerModule.child({
            module: 'event',
            name: 'clientDebug',
            executionId: executionId
        });

        logger.debug(message);
    }
};
