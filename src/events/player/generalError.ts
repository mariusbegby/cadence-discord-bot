import config from 'config';
import { BaseGuildTextChannel, EmbedBuilder } from 'discord.js';
import { randomUUID as uuidv4 } from 'node:crypto';
import { Logger } from 'pino';
import loggerModule from '../../services/logger';
import { EmbedOptions, SystemOptions } from '../../types/configTypes';
import { ExtendedGuildQueuePlayerNode } from '../../types/eventTypes';

const embedOptions: EmbedOptions = config.get('embedOptions');
const systemOptions: SystemOptions = config.get('systemOptions');
// Emitted when the player queue encounters error (general error with queue)
module.exports = {
    name: 'error',
    isDebug: false,
    isPlayerEvent: true,
    execute: async (queue: ExtendedGuildQueuePlayerNode, error: Error) => {
        const executionId: string = uuidv4();
        const logger: Logger = loggerModule.child({
            module: 'event',
            name: 'playerGeneralError',
            executionId: executionId,
            shardId: queue.metadata?.client.shard?.ids[0],
            guildId: queue.metadata?.channel.guild.id
        });

        logger.error(error, "player.events.on('error'): Player queue encountered error event");

        // TODO: check for access to send message to channel to avoid possible DiscordAPIError - Missing Access
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
                            .setTitle("player.events.on('error')")
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
