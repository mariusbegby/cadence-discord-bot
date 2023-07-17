const path = require('node:path');
const logger = require(path.resolve('./src/services/logger.js'));
const { Events, ActivityType, PresenceUpdateStatus } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    isDebug: false,
    once: true,
    execute: async (client) => {
        logger.info(`Client logged in successfully as ${client.user.tag}!`);
        await client.user.setPresence({
            status: PresenceUpdateStatus.Online,
            activities: [
                {
                    name: '/help',
                    type: ActivityType.Watching
                }
            ]
        });
    }
};
