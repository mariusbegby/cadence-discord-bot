const logger = require('../../services/logger');
const config = require('config');
const embedOptions = config.get('embedOptions');
const systemOptions = config.get('systemOptions');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'reconnecting',
    isDebug: false,
    once: false,
    execute: async (client) => {
        logger.warn(`${client.user.tag} is reconnecting to Discord APIs.`);

        // send message to system message channel for event
        if (systemOptions.systemMessageChannelId && systemOptions.systemUserId) {
            if (systemOptions.systemMessageChannelId && systemOptions.systemUserId) {
                const channel = await client.channels.cache.get(systemOptions.systemMessageChannelId);
                if (channel) {
                    await channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(
                                    `${embedOptions.icons.warning} **${client.user.tag}** is **\`reconnecting\`**!` +
                                        `\n\n<@${systemOptions.systemUserId}>`
                                )
                                .setColor(embedOptions.colors.warning)
                        ]
                    });
                }
            }
        }
    }
};
