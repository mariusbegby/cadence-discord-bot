const { v4: uuidv4 } = require('uuid');
const config = require('config');
const embedOptions = config.get('embedOptions');
const systemOptions = config.get('systemOptions');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'disconnect',
    isDebug: false,
    once: false,
    execute: async (client) => {
        const executionId = uuidv4();

        const logger = require('../../services/logger').child({
            source: 'disconnect.js',
            module: 'event',
            name: 'clientDisconnect',
            executionId: executionId,
            shardId: client.shard.ids[0]
        });

        logger.warn(`${client.user.tag} lost connection to Discord APIs. Disconnected.`);

        // send message to system message channel for event
        if (systemOptions.systemMessageChannelId && systemOptions.systemUserId) {
            const channel = await client.channels.cache.get(systemOptions.systemMessageChannelId);
            if (channel) {
                await channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(
                                `${embedOptions.icons.warning} **${client.user.tag}** is **\`disconnected\`**!` +
                                    `\n\n<@${systemOptions.systemUserId}>`
                            )
                            .setColor(embedOptions.colors.warning)
                    ]
                });
            }
        }
    }
};
