import { ExtendedGuildQueuePlayerNode } from '../../types/eventTypes';
import { useLanguageTranslator } from '../../common/utils/localeUtil';
import { EmbedBuilder, LocaleString } from 'discord.js';
import { EmbedOptions } from '../../types/configTypes';
import { randomUUID as uuidv4 } from 'node:crypto';
import { loggerService, Logger } from '../../common/services/logger';
import { Track } from 'discord-player';
import config from 'config';

module.exports = {
    name: 'playerStart',
    isDebug: false,
    isPlayerEvent: true,
    execute: async (queue: ExtendedGuildQueuePlayerNode, track: Track) => {
        const executionId: string = uuidv4();
        const logger: Logger = loggerService.child({
            module: 'event',
            name: 'playerStart',
            executionId: executionId,
            shardId: queue.metadata?.client.shard?.ids[0],
            guildId: queue.metadata?.channel.guild.id
        });

        logger.debug(`playerStart event: Started playing '${track.url}'.`);

        const { channel, client } = queue.metadata || {};
        const embedOptions: EmbedOptions = config.get('embedOptions');

        if (!embedOptions.behavior.enablePlayerStartMessages) {
            logger.debug('playerStart event: Player start messages are disabled, skipping now-playing message.');
            return;
        }

        if (channel && !client?.channels.cache.get(channel.id)) {
            logger.warn(
                `playerStart event: No channel found for guild ${queue.metadata?.channel.guild.id}, cannot send now-playing message.`
            );
            return;
        }

        const guildLanguage: LocaleString =
            queue.metadata?.client.guilds.cache.get(queue.metadata?.channel.guild.id)?.preferredLocale ?? 'en-US';
        const translator = useLanguageTranslator(guildLanguage);

        const translatedEmbedMessage: string = translator('musicPlayerCommon.nowPlayingTitle', {
            icon: embedOptions.icons.audioStartedPlaying
        });

        const embed = new EmbedBuilder()
            .setAuthor({
                name: track.requestedBy?.username as string,
                iconURL: track.requestedBy?.displayAvatarURL()
            })
            .setDescription(`${translatedEmbedMessage}\n\`${track.duration}\` [**${track.title}**](${track.url})`)
            .setThumbnail(track.thumbnail)
            .setColor(embedOptions.colors.info);

        try {
            const announceMessage = await channel?.send({ embeds: [embed] });

            if (queue.metadata && announceMessage) {
                queue.metadata.lastMessage = announceMessage;
            }
        } catch (error) {
            logger.error(error, 'playerStart event: Error trying to send now-playing message.');
            return;
        }

        logger.debug('playerStart event: now-playing message sent.');
    }
};
