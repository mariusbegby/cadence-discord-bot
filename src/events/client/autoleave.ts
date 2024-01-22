import { Events, VoiceState } from 'discord.js';
import { randomUUID as uuidv4 } from 'node:crypto';
import { Logger } from 'pino';
import loggerModule from '../../services/logger';

module.exports = {
    name: Events.VoiceStateUpdate,
    isDebug: false,
    once: false,
    execute: async (oldState: VoiceState) => {
        if (!oldState) {
            return;
        }
        const members = oldState.channel?.members;
        if (!members || members.size === 0) {
            return;
        }
        if (!members.find((member) => member.id === oldState.client.user.id)) {
            return;
        }

        if (members.size === 1) {
            const executionId: string = uuidv4();
            const logger: Logger = loggerModule.child({
                module: 'event',
                name: 'autoLeave',
                executionId: executionId
            });

            logger.info(`Leaving ${oldState.channel?.name} due to empty channel`);
            oldState.guild.members.me?.voice.disconnect();
        }
    }
};
