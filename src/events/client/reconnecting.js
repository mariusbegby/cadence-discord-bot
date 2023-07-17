const path = require('node:path');
const logger = require(path.resolve('./src/services/logger.js'));
const { EmbedBuilder } = require('discord.js');
const { systemMessageChannelId, systemUserId, embedColors, embedIcons } = require(path.resolve('./config.json'));

module.exports = {
    name: 'reconnecting',
    isDebug: false,
    once: false,
    execute: async (client) => {
        logger.warn(`${client.user.tag} is reconnecting to Discord APIs.`);

        // send message to system message channel for event
        if (systemMessageChannelId && systemUserId) {
            await client.channels.cache.get(systemMessageChannelId).send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `${embedIcons.warning} **${client.user.tag}** is **\`reconnecting\`**!` +
                                `\n<@${systemUserId}>`
                        )
                        .setColor(embedColors.colorWarning)
                ]
            });
        }
    }
};
