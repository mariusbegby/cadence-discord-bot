import { Events } from 'discord.js';
import { Logger } from 'pino';
import { v4 as uuidv4 } from 'uuid';
import loggerModule from '../../services/logger';

module.exports = {
    name: Events.Warn,
    isDebug: false,
    once: false,
    execute: async (warning: string) => {
        const executionId: string = uuidv4();
        const logger: Logger = loggerModule.child({
            module: 'event',
            name: 'clientWarn',
            executionId: executionId
        });

        logger.warn(warning);
    }
};
