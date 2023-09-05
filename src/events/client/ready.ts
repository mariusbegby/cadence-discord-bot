import config from 'config';
import { BaseGuildTextChannel, EmbedBuilder, Events, PresenceData } from 'discord.js';
import { randomUUID as uuidv4 } from 'node:crypto';
import { Logger } from 'pino';
import loggerModule from '../../services/logger';
import { ExtendedClient } from '../../types/clientTypes';
import { EmbedOptions, LoadTestOptions, SystemOptions } from '../../types/configTypes';
import { postBotStats } from '../../utils/other/postBotStats';
import { startLoadTest } from '../../utils/other/startLoadTest';

const embedOptions: EmbedOptions = config.get('embedOptions');
const systemOptions: SystemOptions = config.get('systemOptions');
const presenceStatusOptions: PresenceData = config.get('presenceStatusOptions');
const loadTestOptions: LoadTestOptions = config.get('loadTestOptions');
module.exports = {
    name: Events.ClientReady,
    isDebug: false,
    once: false,
    execute: async (client: ExtendedClient) => {
        const executionId: string = uuidv4();
        const logger: Logger = loggerModule.child({
            module: 'event',
            name: 'clientReady',
            executionId: executionId,
            shardId: client.shard?.ids[0]
        });

        logger.debug("Client 'ready' event received after 'allShardsReady' event.");
        await client.user?.setPresence(presenceStatusOptions);

        if (loadTestOptions.enabled) {
            // Only call function from shard with id 0
            // The function uses broadcastEval() to call itself on all shards
            if (client.shard?.ids[0] === 0) {
                logger.info('Initiating load test for bot client.');
                await startLoadTest({ client, executionId });
            }
        }

        const channel: BaseGuildTextChannel = (await client.channels.cache.get(
            systemOptions.systemMessageChannelId
        )) as BaseGuildTextChannel;

        // Check if the channel exists in curent shard and send a message
        if (channel) {
            logger.debug(`Sending system message for 'allShardsReady' to channel id ${channel.id}.`);
            channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${embedOptions.icons.success} All shards ready**\n**${client.user?.tag}** is now **\`online\`**!`
                        )
                        .setColor(embedOptions.colors.success)
                ]
            });
        }

        process.env.NODE_ENV === 'production' ? await postBotStats({ client, executionId }) : null;
    }
};
