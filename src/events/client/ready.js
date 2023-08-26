const config = require('config');
const embedOptions = config.get('embedOptions');
const systemOptions = config.get('systemOptions');
const presenceStatusOptions = config.get('presenceStatusOptions');
const loadTestOptions = config.get('loadTestOptions');
const { postBotStats } = require('../../utils/other/postBotStats.js');
const { startLoadTest } = require('../../utils/other/startLoadTest');
const { Events, EmbedBuilder } = require('discord.js');
const { v4: uuidv4 } = require('uuid');

module.exports = {
    name: Events.ClientReady,
    isDebug: false,
    once: false,
    execute: async (client) => {
        const executionId = uuidv4();

        const logger = require('../../services/logger').child({
            source: 'ready.js',
            module: 'event',
            name: 'clientReady',
            executionId: executionId,
            shardId: client.shard.ids[0]
        });

        logger.debug('Client \'ready\' event received after \'allShardsReady\' event.');
        await client.user.setPresence(presenceStatusOptions);

        if (loadTestOptions.enabled) {
            // Only call function from shard with id 0
            // The function uses broadcastEval() to call itself on all shards
            if (client.shard.ids[0] === 0) {
                logger.info('Initiating load test for bot client.');
                await startLoadTest({ client, executionId });
            }
        }

        const channel = await client.channels.cache.get(systemOptions.systemMessageChannelId);

        // Check if the channel exists in curent shard and send a message
        if (channel) {
            logger.debug(`Sending system message for 'allShardsReady' to channel id ${channel.id}.`);
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

        process.env.NODE_ENV === 'production' ? await postBotStats({ client, executionId }) : null;
    }
};
