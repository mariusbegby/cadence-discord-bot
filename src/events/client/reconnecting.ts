import config from 'config';
import { BaseGuildTextChannel, EmbedBuilder } from 'discord.js';
import { v4 as uuidv4 } from 'uuid';

import loggerModule from '../../services/logger';
import { ExtendedClient } from '../../types/clientTypes';
import { EmbedOptions, SystemOptions } from '../../types/configTypes';

const embedOptions: EmbedOptions = config.get('embedOptions');
const systemOptions: SystemOptions = config.get('systemOptions');
module.exports = {
    name: 'reconnecting',
    isDebug: false,
    once: false,
    execute: async (client: ExtendedClient) => {
        const executionId = uuidv4();
        const logger = loggerModule.child({
            source: 'reconnecting.js',
            module: 'event',
            name: 'clientReconnecting',
            executionId: executionId,
            shardId: client.shard?.ids[0]
        });

        logger.warn('Client is reconnecting to Discord APIs.');

        // send message to system message channel for event
        if (systemOptions.systemMessageChannelId && systemOptions.systemUserId) {
            if (systemOptions.systemMessageChannelId && systemOptions.systemUserId) {
                const channel = (await client.channels.cache.get(
                    systemOptions.systemMessageChannelId
                )) as BaseGuildTextChannel;
                if (channel) {
                    await channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(
                                    `${embedOptions.icons.warning} **${client.user?.tag}** is **\`reconnecting\`**!` +
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
