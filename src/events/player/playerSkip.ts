import config from 'config';
import { type Track, TrackSkipReason } from 'discord-player';
import { type BaseGuildTextChannel, EmbedBuilder } from 'discord.js';
import { randomUUID as uuidv4 } from 'node:crypto';
import { loggerService, type Logger } from '../../common/services/logger';
import type { BotOptions, EmbedOptions, SystemOptions } from '../../types/configTypes';
import type { ExtendedGuildQueuePlayerNode } from '../../types/eventTypes';
import { useLanguageTranslator } from '../../common/utils/localeUtil';

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
        const logger: Logger = loggerService.child({
            module: 'event',
            name: 'playerSkip',
            executionId: executionId,
            shardId: queue.metadata?.client.shard?.ids[0],
            guildId: queue.metadata?.channel.guild.id
        });

        const language =
            queue.metadata?.client.guilds.cache.get(queue.metadata?.channel.guild.id)?.preferredLocale ?? 'en-US';
        const translator = useLanguageTranslator(language);

        logger.debug(`Track [${track.url}] skipped with reason: ${reason}\n${description}`);

        if (reason === TrackSkipReason.NoStream) {
            logger.warn(`player.events.on('playerSkip'): Failed to play '${track.url}'.\n${description}`);

            if (description.includes('Could not extract stream for this track')) {
                try {
                    return await queue.metadata?.channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(
                                    translator('errors.cannotExtractAudioStream', {
                                        icon: embedOptions.icons.warning,
                                        trackTitle: track.title,
                                        trackUrl: track.url
                                    })
                                )
                                .setColor(embedOptions.colors.warning)
                        ]
                    });
                }
                catch (error) {
                    logger.warn('Failed to send \'errors.cannotExtractAudioStream\' ,error message to channel.');
                }
            } else {
                try {
                    await queue.metadata?.channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(
                                    translator('errors.cannotLoadAudioStream', {
                                        icon: embedOptions.icons.error,
                                        serverInviteUrl: botOptions.serverInviteUrl
                                    })
                                )
                                .setColor(embedOptions.colors.error)
                                .setFooter({ text: translator('errors.footerExecutionId', { executionId: executionId }) })
                        ]
                    });
                } catch (error) {
                    logger.warn('Failed to send \'errors.cannotLoadAudioStream\' error message to channel.');
                }
            }
        }
    }
};
