import config from 'config';
import { Track } from 'discord-player';
import { BaseGuildTextChannel, EmbedBuilder } from 'discord.js';
import { randomUUID as uuidv4 } from 'node:crypto';
import { Logger } from 'pino';
import loggerModule from '../../services/logger';
import { EmbedOptions, SystemOptions } from '../../types/configTypes';
import { ExtendedGuildQueuePlayerNode } from '../../types/eventTypes';

const embedOptions: EmbedOptions = config.get('embedOptions');
const systemOptions: SystemOptions = config.get('systemOptions');
// Emitted when the audio player fails to load the stream for a track
module.exports = {
    name: 'playerSkip',
    isDebug: false,
    isPlayerEvent: true,
    execute: async (queue: ExtendedGuildQueuePlayerNode, track: Track) => {
        const executionId: string = uuidv4();
        const logger: Logger = loggerModule.child({
            module: 'event',
            name: 'playerSkip',
            executionId: executionId,
            shardId: queue.metadata?.client.shard?.ids[0],
            guildId: queue.metadata?.channel.guild.id
        });

        logger.error(`player.events.on('playerSkip'): Failed to play '${track.url}'.`);

        await queue.metadata?.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${embedOptions.icons.nyctophileZuiWarning} | Uh-oh...** Sepertinya ada masalah terkait antrian atau lagu (trakcs) saat ini!`
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
                            .setTitle("player.events.on('playerSkip')")
                            .setDescription(
                                `**${embedOptions.icons.nyctophileZuiMegaphone} | Kesalahan** pada: ${track.url}\n` +
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
