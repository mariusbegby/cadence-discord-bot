import { Events } from 'discord.js';
import { randomUUID as uuidv4 } from 'node:crypto';
import { loggerService, Logger } from '../../common/services/logger';

module.exports = {
    name: Events.Warn,
    isDebug: false,
    once: false,
    execute: async (warning: string) => {
        const executionId: string = uuidv4();
        const logger: Logger = loggerService.child({
            module: 'event',
            name: 'clientWarn',
            executionId: executionId
        });

        logger.warn(warning);
    }
};
