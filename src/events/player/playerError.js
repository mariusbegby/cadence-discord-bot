const logger = require('../../services/logger');
const { embedOptions, systemOptions, botOptions } = require('../../config');
const { EmbedBuilder } = require('discord.js');

// Emitted when the player encounters an error while streaming audio track
module.exports = {
    name: 'error',
    isDebug: false,
    isPlayerEvent: true,
    execute: async (queue, error) => {
        logger.error(
            error,
            `[Shard ${queue.metadata.client.shard.ids[0]}] player.events.on('playerError'): Player error while streaming track`
        );

        await queue.metadata.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${embedOptions.icons.error} Uh-oh... _Something_ went wrong!**\nIt seems there was an issue while streaming the track.\n\nIf you performed a command, you can try again.\n\n_If this problem persists, please submit a bug report in the **[support server](${botOptions.serverInviteUrl})**._`
                    )
                    .setColor(embedOptions.colors.error)
            ]
        });

        if (systemOptions.systemMessageChannelId && systemOptions.systemUserId) {
            const channel = await queue.metadata.client.channels.cache.get(systemOptions.systemMessageChannelId);
            if (channel) {
                await channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(
                                `${embedOptions.icons.error} **player.events.on('playerError')**\n${error.message}` +
                                    `\n\n<@${systemOptions.systemUserId}>`
                            )
                            .setColor(embedOptions.colors.error)
                    ]
                });
            }
        }

        process.env.NODE_ENV === 'development' ? logger.trace(queue, 'Queue object') : null;
    }
};
