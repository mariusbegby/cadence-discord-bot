import config from 'config';
import { NodeResolvable, useQueue } from 'discord-player';
import { EmbedBuilder, GuildMember } from 'discord.js';

import loggerModule from '../../services/logger';
import { EmbedOptions } from '../../types/configTypes';
import { CustomComponentInteraction } from '../../types/interactionTypes';
const embedOptions: EmbedOptions = config.get('embedOptions');

const component: CustomComponentInteraction = {
    execute: async ({ interaction, referenceId, executionId }) => {
        const logger = loggerModule.child({
            source: 'nowplaying-skip.js',
            module: 'componentInteraction',
            name: 'nowplaying-skip',
            executionId: executionId,
            shardId: interaction.guild?.shardId,
            guildId: interaction.guild?.id
        });

        logger.debug(`Received skip confirmation for track id ${referenceId}.`);

        const queue: NodeResolvable = useQueue(interaction.guild!.id)!;

        if (!queue || (queue.tracks.data.length === 0 && !queue.currentTrack)) {
            logger.debug('Tried skipping track but there was no queue.');

            logger.debug('Responding with warning embed.');
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${embedOptions.icons.warning} Oops!**\nThere is nothing currently playing. First add some tracks with **\`/play\`**!`
                        )
                        .setColor(embedOptions.colors.warning)
                ],
                components: []
            });
        }

        if (queue.currentTrack!.id !== referenceId) {
            logger.debug('Tried skipping track but it is not the current track and therefore already skipped/removed.');

            logger.debug('Responding with warning embed.');
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${embedOptions.icons.warning} Oops!**\nThis track has already been skipped or is no longer playing.`
                        )
                        .setColor(embedOptions.colors.warning)
                ],
                components: []
            });
        }

        const skippedTrack = queue.currentTrack!;
        let durationFormat =
            Number(skippedTrack.raw.duration) === 0 || skippedTrack.duration === '0:00'
                ? ''
                : `\`${skippedTrack.duration}\``;

        if (skippedTrack.raw.live) {
            durationFormat = `${embedOptions.icons.liveTrack} \`LIVE\``;
        }
        queue.node.skip();
        logger.debug('Skipped the track.');

        const loopModesFormatted = new Map([
            [0, 'disabled'],
            [1, 'track'],
            [2, 'queue'],
            [3, 'autoplay']
        ]);

        const repeatModeUserString = loopModesFormatted.get(queue.repeatMode);

        let authorName: string;

        if (interaction.member instanceof GuildMember) {
            authorName = interaction.member.nickname || interaction.user.username;
        } else {
            authorName = interaction.user.username;
        }

        logger.debug('Responding with success embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: authorName,
                        iconURL: interaction.user.avatarURL() || ''
                    })
                    .setDescription(
                        `**${embedOptions.icons.skipped} Skipped track**\n**${durationFormat} [${skippedTrack.title}](${
                            skippedTrack.raw.url ?? skippedTrack.url
                        })**` +
                            `${
                                queue.repeatMode === 0
                                    ? ''
                                    : `\n\n**${
                                        queue.repeatMode === 3
                                            ? embedOptions.icons.autoplaying
                                            : embedOptions.icons.looping
                                    } Looping**\nLoop mode is set to ${repeatModeUserString}. You can change it with **\`/loop\`**.`
                            }`
                    )
                    .setThumbnail(skippedTrack.thumbnail)
                    .setColor(embedOptions.colors.success)
            ],
            components: []
        });
    }
};

export default component;
