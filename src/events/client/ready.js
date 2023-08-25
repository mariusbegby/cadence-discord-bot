const logger = require('../../services/logger');
const config = require('config');
const embedOptions = config.get('embedOptions');
const systemOptions = config.get('systemOptions');
const presenceStatusOptions = config.get('presenceStatusOptions');
const loadTestOptions = config.get('loadTestOptions');
const { postBotStats } = require('../../utils/other/postBotStats.js');
const { startLoadTest } = require('../../utils/other/startLoadTest');
const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    isDebug: false,
    once: false,
    execute: async (client) => {
        logger.debug(`[Shard ${client.shard.ids[0]}] Client 'ready' event emitted after 'allShardsReady'.`);
        await client.user.setPresence(presenceStatusOptions);
        await client.user.setPresence(presenceStatusOptions);

        if (loadTestOptions.enabled) {
            logger.info(`[Shard ${client.shard.ids[0]}] STARTING LOAD TEST.`);
            await startLoadTest(client);
        }

        const channel = await client.channels.cache.get(systemOptions.systemMessageChannelId);
        logger.info(`[Shard ${client.shard.ids[0]}] ALL SHARDS READY`);

        // Check if the channel exists in curent shard and send a message
        if (channel) {
            logger.info(
                `[Shard ${client.shard.ids[0]}] Sending system message for 'allShardsReady' to channel id ${channel.id}.`
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
