const logger = require('../../services/logger');
const { embedOptions, systemOptions } = require('../../config');
const { Events, ActivityType, PresenceUpdateStatus, EmbedBuilder } = require('discord.js');
const { postBotStats } = require('../../utils/postBotStats.js');

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

        // Post bot stats to bot lists in production
        process.env.NODE_ENV === 'production' ? postBotStats(client) : null;

        // send message to system message channel for event
        if (systemOptions.systemMessageChannelId) {
            await client.channels.cache.get(systemOptions.systemMessageChannelId).send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`${embedOptions.icons.success} **${client.user.tag}** is now **\`online\`**!`)
                        .setColor(embedOptions.colors.success)
                ]
            });
        }
    }
};
