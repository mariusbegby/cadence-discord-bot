import config from 'config';
import { Track, TrackSkipReason } from 'discord-player';
import { BaseGuildTextChannel, EmbedBuilder } from 'discord.js';
import { randomUUID as uuidv4 } from 'node:crypto';
import { Logger } from 'pino';
import loggerModule from '../../services/logger';
import { BotOptions, EmbedOptions, SystemOptions } from '../../types/configTypes';
import { ExtendedGuildQueuePlayerNode } from '../../types/eventTypes';

const embedOptions: EmbedOptions = config.get('embedOptions');
const botOptions: BotOptions = config.get('botOptions');
const systemOptions: SystemOptions = config.get('systemOptions');

// Emitted when the audio player skips a track.
module.exports = {
    name: 'playerSkip',
    isDebug: false,
    isPlayerEvent: true,
    execute: async (
        queue: ExtendedGuildQueuePlayerNode,
        track: Track,
        reason: TrackSkipReason,
        description: string
    ) => {
        const executionId: string = uuidv4();
        const logger: Logger = loggerModule.child({
            module: 'event',
            name: 'playerSkip',
            executionId: executionId,
            shardId: queue.metadata?.client.shard?.ids[0],
            guildId: queue.metadata?.channel.guild.id
        });

        logger.debug(`Track [${track.url}] skipped with reason: ${reason}\n${description}`);

        if (reason === TrackSkipReason.NoStream) {
            logger.error(`player.events.on('playerSkip'): Failed to play '${track.url}'.\n${description}`);
            await queue.metadata?.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${embedOptions.icons.error} Uh-oh... _Something_ went wrong!**\nIt seems there was an issue while loading stream for the track.\n\nIf you performed a command, you can try again.\n\n_If this problem persists, please submit a bug report in the **[support server](${botOptions.serverInviteUrl})**._`
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
                                .setDescription(
                                    `${embedOptions.icons.error} **player.events.on('playerSkip')**\nExecution id: ${executionId}\n${track.url}` +
                                        `\n\n<@${systemOptions.systemUserId}>`
                                )
                                .setColor(embedOptions.colors.error)
                                .setFooter({ text: `Execution ID: ${executionId}` })
                        ]
                    });
                }
            }
        }
    }
};
