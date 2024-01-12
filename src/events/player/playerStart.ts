import { Track } from 'discord-player';
import { randomUUID as uuidv4 } from 'node:crypto';
import { Logger } from 'pino';
import loggerModule from '../../services/logger';
import { ExtendedGuildQueuePlayerNode } from '../../types/eventTypes';
import { EmbedBuilder } from 'discord.js';
import { useLanguageTranslator } from '../../common/localeUtil';
import { EmbedOptions } from '../../types/configTypes';
import config from 'config';

module.exports = {
    name: 'playerStart',
    isDebug: false,
    isPlayerEvent: true,
    execute: async (queue: ExtendedGuildQueuePlayerNode, track: Track) => {
        const executionId: string = uuidv4();
        const logger: Logger = loggerModule.child({
            module: 'event',
            name: 'playerStart',
            executionId: executionId,
            shardId: queue.metadata?.client.shard?.ids[0],
            guildId: queue.metadata?.channel.guild.id
        });

        logger.debug(`playerStart event: Started playing '${track.url}'.`);

        const { channel } = queue.metadata || {};
        const embedOptions: EmbedOptions = config.get('embedOptions');

        const language =
            queue.metadata?.client.guilds.cache.get(queue.metadata?.channel.guild.id)?.preferredLocale ?? 'en-US';
        const translator = useLanguageTranslator(language);

        const nowPlayingMessage = translator('musicPlayerCommon.nowPlayingTitle', {
            icon: embedOptions.icons.audioStartedPlaying
        });

        const playingMessageEmbed = new EmbedBuilder()
            .setAuthor({
                name: track.requestedBy?.username as string,
                iconURL: track.requestedBy?.displayAvatarURL()
            })
            .setDescription(`${nowPlayingMessage}\n\`${track.duration}\` [**${track.title}**](${track.url})`)
            .setThumbnail(track.thumbnail)
            .setColor(embedOptions.colors.info);

        const lastAnnounceMessage = await channel?.send({ embeds: [playingMessageEmbed] });

        if (queue.metadata && lastAnnounceMessage) {
            queue.metadata.lastMessage = lastAnnounceMessage;
        }

        logger.debug(`playerStart event: now-playing message sent.`);
    }
};