const logger = require('../../services/logger');
const { embedOptions, systemOptions, botOptions } = require('../../config');
const { EmbedBuilder } = require('discord.js');

// Emitted when the player queue encounters error (general error with queue)
module.exports = {
    name: 'error',
    isDebug: false,
    isPlayerEvent: true,
    execute: async (queue, error) => {
        logger.error(error, 'player.events.on(\'error\'): Player queue encountered error event');

        await queue.metadata.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${embedOptions.icons.error} Uh-oh... _Something_ went wrong!**\nIt seems there was an issue related to the queue or current track.\n\nIf you performed a command, you can try again.\n\n_If this problem persists, please submit a bug report in the **[support server](${botOptions.serverInviteUrl})**._`
                    )
                    .setColor(embedOptions.colors.error)
            ]
        });

        if (systemOptions.systemMessageChannelId && systemOptions.systemUserId) {
            await queue.metadata.client.channels.cache.get(systemOptions.systemMessageChannelId).send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `${embedOptions.icons.error} **player.events.on('error')**\n${error.message}` +
                                `\n\n<@${systemOptions.systemUserId}>`
                        )
                        .setColor(embedOptions.colors.error)
                ]
            });
        }

        process.env.NODE_ENV === 'development' ? logger.trace(queue, 'Queue object') : null;
    }
};
