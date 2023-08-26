import { v4 as uuidv4 } from 'uuid';
import config from 'config';
import { EmbedOptions } from '../../types/configTypes';
const embedOptions: EmbedOptions = config.get('embedOptions');
const systemOptions = config.get('systemOptions');
import { EmbedBuilder } from 'discord.js';
import loggerModule from '../../services/logger';

module.exports = {
    name: 'reconnecting',
    isDebug: false,
    once: false,
    execute: async (client) => {
        const executionId = uuidv4();
        const logger = loggerModule.child({
            source: 'reconnecting.js',
            module: 'event',
            name: 'clientReconnecting',
            executionId: executionId,
            shardId: client.shard.ids[0]
        });

        logger.warn('Client is reconnecting to Discord APIs.');

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
