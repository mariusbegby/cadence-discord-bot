import { Events } from 'discord.js';
import { randomUUID as uuidv4 } from 'node:crypto';
import { Logger } from 'pino';
import loggerModule from '../../services/logger';

module.exports = {
    name: Events.Error,
    isDebug: false,
    once: false,
    execute: async (error: Error) => {
        const executionId: string = uuidv4();
        const logger: Logger = loggerModule.child({
            module: 'event',
            name: 'clientError',
            executionId: executionId
        });

        logger.error(error);
    }
};
