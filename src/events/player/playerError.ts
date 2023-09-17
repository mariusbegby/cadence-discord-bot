import config from 'config';
import { BaseGuildTextChannel, EmbedBuilder } from 'discord.js';
import { randomUUID as uuidv4 } from 'node:crypto';
import { Logger } from 'pino';
import loggerModule from '../../services/logger';
import { EmbedOptions, SystemOptions } from '../../types/configTypes';
import { ExtendedGuildQueuePlayerNode } from '../../types/eventTypes';

const embedOptions: EmbedOptions = config.get('embedOptions');
const systemOptions: SystemOptions = config.get('systemOptions');
// Emitted when the player encounters an error while streaming audio track
module.exports = {
    name: 'error',
    isDebug: false,
    isPlayerEvent: true,
    execute: async (queue: ExtendedGuildQueuePlayerNode, error: Error) => {
        const executionId: string = uuidv4();
        const logger: Logger = loggerModule.child({
            module: 'event',
            name: 'playerError',
            executionId: executionId,
            shardId: queue.metadata?.client.shard?.ids[0],
            guildId: queue.metadata?.channel.guild.id
        });

        logger.error(error, "player.events.on('playerError'): Player error while streaming track");

        await queue.metadata?.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${embedOptions.icons.nyctophileZuiWarning} | Uh-oh...** Sepertinya ada masalah terkait antrian atau lagu (tracks) saat ini!`
                    )
                    .setColor(embedOptions.colors.error)
                    .setFooter({ text: `Execution ID: ${executionId}` })
            ]
        });

        if (systemOptions.systemMessageChannelId && systemOptions.systemUserId) {
            const channel: BaseGuildTextChannel = (await queue.metadata?.client.channels.cache.get(
                systemOptions.systemMessageChannelId
            )) as BaseGuildTextChannel;
            if (channel) {
                await channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("player.events.on('playerError')")
                            .setDescription(
                                `**${embedOptions.icons.nyctophileZuiMegaphone} | Kesalahan** pada: ${error.message}\n` +
                                    `\n<@${systemOptions.systemUserId}>`
                            )
                            .setFooter({ text: `Execution ID: ${executionId}` })
                            .setColor(embedOptions.colors.error)
                    ]
                });
            }
        }
    }
};
