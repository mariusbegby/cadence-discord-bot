const config = require('config');
const embedOptions = config.get('embedOptions');
const botOptions = config.get('botOptions');
const systemOptions = config.get('systemOptions');
const { EmbedBuilder } = require('discord.js');
const { v4: uuidv4 } = require('uuid');

// Emitted when the player encounters an error while streaming audio track
module.exports = {
    name: 'error',
    isDebug: false,
    isPlayerEvent: true,
    execute: async (queue, error) => {
        const executionId = uuidv4();

        const logger = require('../../services/logger').child({
            source: 'playerError.js',
            module: 'event',
            name: 'playerError',
            executionId: executionId,
            shardId: queue.metadata.client.shard.ids[0],
            guildId: queue.metadata.channel.guild.id
        });

        logger.error(error, 'player.events.on(\'playerError\'): Player error while streaming track');

        await queue.metadata.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${embedOptions.icons.error} Uh-oh... _Something_ went wrong!**\nIt seems there was an issue while streaming the track.\n\nIf you performed a command, you can try again.\n\n_If this problem persists, please submit a bug report in the **[support server](${botOptions.serverInviteUrl})**._`
                    )
                    .setColor(embedOptions.colors.error)
                    .setFooter({ text: `Execution ID: ${executionId}` })
            ]
        });

        if (systemOptions.systemMessageChannelId && systemOptions.systemUserId) {
            const channel = await queue.metadata.client.channels.cache.get(systemOptions.systemMessageChannelId);
            if (channel) {
                await channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(
                                `${embedOptions.icons.error} **player.events.on('playerError')**\nExecution id: ${executionId}\n${error.message}` +
                                    `\n\n<@${systemOptions.systemUserId}>`
                            )
                            .setColor(embedOptions.colors.error)
                            .setFooter({ text: `Execution ID: ${executionId}` })
                    ]
                });
            }
        }

        process.env.NODE_ENV === 'development' ? logger.trace(queue, 'Queue object') : null;
    }
};
