import config from 'config';
import { BaseGuildTextChannel, EmbedBuilder } from 'discord.js';
import { randomUUID as uuidv4 } from 'node:crypto';
import { Logger } from 'pino';
import loggerModule from '../../services/logger';
import { ExtendedClient } from '../../types/clientTypes';
import { EmbedOptions, SystemOptions } from '../../types/configTypes';

const embedOptions: EmbedOptions = config.get('embedOptions');
const systemOptions: SystemOptions = config.get('systemOptions');
module.exports = {
    name: 'disconnect',
    isDebug: false,
    once: false,
    execute: async (client: ExtendedClient) => {
        const executionId: string = uuidv4();
        const logger: Logger = loggerModule.child({
            module: 'event',
            name: 'clientDisconnect',
            executionId: executionId,
            shardId: client.shard?.ids[0]
        });

        logger.warn(`${client.user?.tag} lost connection to Discord APIs. Disconnected.`);

        // send message to system message channel for event
        if (systemOptions.systemMessageChannelId && systemOptions.systemUserId) {
            const channel: BaseGuildTextChannel = (await client.channels.cache.get(
                systemOptions.systemMessageChannelId
            )) as BaseGuildTextChannel;
            if (channel) {
                await channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(
                                `${embedOptions.icons.warning} **${client.user?.tag}** is **\`disconnected\`**!` +
                                    `\n\n<@${systemOptions.systemUserId}>`
                            )
                            .setColor(embedOptions.colors.warning)
                    ]
                });
            }
        }
    }
};
