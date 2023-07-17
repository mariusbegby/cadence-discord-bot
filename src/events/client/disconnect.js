const path = require('node:path');
const logger = require(path.resolve('./src/services/logger.js'));
const { EmbedBuilder } = require('discord.js');
const { systemMessageChannelId, systemUserId, embedColors, embedIcons } = require(path.resolve('./config.json'));

module.exports = {
    name: 'disconnect',
    isDebug: false,
    once: false,
    execute: async (client) => {
        logger.warn(`${client.user.tag} lost connection to Discord APIs. Disconnected.`);

        // send message to system message channel for event
        if (systemMessageChannelId && systemUserId) {
            await client.channels.cache.get(systemMessageChannelId).send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `${embedIcons.warning} **${client.user.tag}** is **\`disconnected\`**!` +
                                `\n<@${systemUserId}>`
                        )
                        .setColor(embedColors.colorWarning)
                ]
            });
        }
    }
};
