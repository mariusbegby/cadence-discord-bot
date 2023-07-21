const logger = require('../../services/logger');
const { embedOptions, systemOptions } = require('../../config');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'reconnecting',
    isDebug: false,
    once: false,
    execute: async (client) => {
        logger.warn(`[Shard ${client.shard.ids[0]}] ${client.user.tag} is reconnecting to Discord APIs.`);

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
