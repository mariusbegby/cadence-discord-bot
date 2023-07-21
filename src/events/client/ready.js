const logger = require('../../services/logger');
const { embedOptions, systemOptions, presenceStatusOptions } = require('../../config');
const { postBotStats } = require('../../utils/other/postBotStats.js');
const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    isDebug: false,
    once: false,
    execute: async (client) => {
        logger.debug(`[Shard ${client.shard.ids[0]}] Client 'ready' event emitted after 'allShardsReady'.`);
        await client.user.setPresence(presenceStatusOptions);
        await client.user.setPresence(presenceStatusOptions);

        const channel = await client.channels.cache.get(systemOptions.systemMessageChannelId);

        // Check if the channel exists in curent shard and send a message
        if (channel) {
            logger.info(
                `[Shard ${client.shard.ids[0]}] ALL SHARDS READY, sending system message to channel id ${channel.id}.`
            );
            channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${embedOptions.icons.success} All shards ready**\n**${client.user.tag}** is now **\`online\`**!`
                        )
                        .setColor(embedOptions.colors.success)
                ]
            });
        }

        process.env.NODE_ENV === 'production' ? await postBotStats(client) : null;
    }
};
