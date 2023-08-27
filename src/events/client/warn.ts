import { v4 as uuidv4 } from 'uuid';
import { Events } from 'discord.js';
import loggerModule from '../../services/logger';

module.exports = {
    name: Events.Warn,
    isDebug: false,
    once: false,
    execute: async (warning: string) => {
        const executionId = uuidv4();
        const logger = loggerModule.child({
            source: 'warn.js',
            module: 'event',
            name: 'clientWarn',
            executionId: executionId
        });

        logger.warn(warning);
    }
};
