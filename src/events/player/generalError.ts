import config from 'config';
import { BaseGuildTextChannel, EmbedBuilder } from 'discord.js';
import { randomUUID as uuidv4 } from 'node:crypto';
import { loggerService, Logger } from '../../common/services/logger';
import { BotOptions, EmbedOptions, SystemOptions } from '../../types/configTypes';
import { ExtendedGuildQueuePlayerNode } from '../../types/eventTypes';
import { useLanguageTranslator } from '../../common/utils/localeUtil';

const embedOptions: EmbedOptions = config.get('embedOptions');
const botOptions: BotOptions = config.get('botOptions');
const systemOptions: SystemOptions = config.get('systemOptions');
// Emitted when the player queue encounters error (general error with queue)
module.exports = {
    name: 'error',
    isDebug: false,
    isPlayerEvent: true,
    execute: async (queue: ExtendedGuildQueuePlayerNode, error: Error) => {
        const executionId: string = uuidv4();
        const logger: Logger = loggerService.child({
            module: 'event',
            name: 'playerGeneralError',
            executionId: executionId,
            shardId: queue.metadata?.client.shard?.ids[0],
            guildId: queue.metadata?.channel.guild.id
        });

        const language =
            queue.metadata?.client.guilds.cache.get(queue.metadata?.channel.guild.id)?.preferredLocale ?? 'en-US';
        const translator = useLanguageTranslator(language);

        logger.error(error, "player.events.on('error'): Player queue encountered error event");

        // TODO: check for access to send message to channel to avoid possible DiscordAPIError - Missing Access
        await queue.metadata?.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        translator('errors.generalPlayerError', {
                            icon: embedOptions.icons.error,
                            serverInviteUrl: botOptions.serverInviteUrl
                        })
                    )
                    .setColor(embedOptions.colors.error)
                    .setFooter({ text: translator('errors.footerExecutionId', { executionId: executionId }) })
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
                                translator('systemMessages.generalPlayerError', {
                                    icon: embedOptions.icons.error,
                                    message: error.message,
                                    userId: systemOptions.systemUserId
                                })
                            )
                            .setColor(embedOptions.colors.error)
                            .setFooter({ text: translator('errors.footerExecutionId', { executionId: executionId }) })
                    ]
                });
            }
        }
    }
};
