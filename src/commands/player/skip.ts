import config from 'config';
import { NodeResolvable, useQueue } from 'discord-player';
import { EmbedBuilder, GuildMember, SlashCommandBuilder } from 'discord.js';

import loggerModule from '../../services/logger';
import { CommandParams } from '../../types/commandTypes';
import { EmbedOptions } from '../../types/configTypes';
import { queueDoesNotExist, queueNoCurrentTrack } from '../../utils/validation/queueValidator';
import { notInSameVoiceChannel, notInVoiceChannel } from '../../utils/validation/voiceChannelValidator';

const embedOptions: EmbedOptions = config.get('embedOptions');
module.exports = {
    isNew: false,
    isBeta: false,
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip current or specified track.')
        .setDMPermission(false)
        .setNSFW(false)
        .addNumberOption((option) =>
            option.setName('tracknumber').setDescription('Track number to skip to in the queue.').setMinValue(1)
        ),
    execute: async ({ interaction, executionId }: CommandParams) => {
        const logger = loggerModule.child({
            source: 'skip.js',
            module: 'slashCommand',
            name: '/skip',
            executionId: executionId,
            shardId: interaction.guild?.shardId,
            guildId: interaction.guild?.id
        });

        if (await notInVoiceChannel({ interaction, executionId })) {
            return;
        }

        const queue: NodeResolvable = useQueue(interaction.guild!.id)!;

        if (await queueDoesNotExist({ interaction, queue, executionId })) {
            return;
        }

        if (await notInSameVoiceChannel({ interaction, queue, executionId })) {
            return;
        }

        if (await queueNoCurrentTrack({ interaction, queue, executionId })) {
            return;
        }

        const skipToTrack = interaction.options.getNumber('tracknumber');

        if (skipToTrack) {
            if (skipToTrack > queue.tracks.data.length) {
                logger.debug('Specified track number was higher than total tracks.');

                logger.debug('Responding with warning embed.');
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(
                                `**${embedOptions.icons.warning} Oops!**\nThere are only **\`${queue.tracks.data.length}\`** tracks in the queue. You cannot skip to track **\`${skipToTrack}\`**.\n\nView tracks added to the queue with **\`/queue\`**.`
                            )
                            .setColor(embedOptions.colors.warning)
                    ]
                });
            } else {
                const skippedTrack = queue.currentTrack!;
                logger.debug('Responding with warning embed.');

                let durationFormat =
                    Number(skippedTrack.raw.duration) === 0 || skippedTrack.duration === '0:00'
                        ? ''
                        : `\`${skippedTrack.duration}\``;

                if (skippedTrack.raw.live) {
                    durationFormat = `${embedOptions.icons.liveTrack} \`LIVE\``;
                }

                queue.node.skipTo(skipToTrack - 1);
                logger.debug('Skipped to specified track number.');

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
                                `**${embedOptions.icons.skipped} Skipped track**\n**${durationFormat} [${
                                    skippedTrack.title
                                }](${skippedTrack.raw.url ?? skippedTrack.url})**`
                            )
                            .setThumbnail(skippedTrack.thumbnail)
                            .setColor(embedOptions.colors.success)
                    ]
                });
            }
        } else {
            if (queue.tracks.data.length === 0 && !queue.currentTrack) {
                logger.debug('No tracks in queue and no current track.');

                logger.debug('Responding with warning embed.');
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(
                                `**${embedOptions.icons.warning} Oops!**\nThere is nothing currently playing. First add some tracks with **\`/play\`**!`
                            )
                            .setColor(embedOptions.colors.warning)
                    ]
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
            logger.debug('Skipped current track.');

            const loopModesFormatted = new Map([
                [0, 'disabled'],
                [1, 'track'],
                [2, 'queue'],
                [3, 'autoplay']
            ]);

            const loopModeUserString = loopModesFormatted.get(queue.repeatMode);

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
                            `**${embedOptions.icons.skipped} Skipped track**\n**${durationFormat} [${
                                skippedTrack.title
                            }](${skippedTrack.raw.url ?? skippedTrack.url})**` +
                                `${
                                    queue.repeatMode === 0
                                        ? ''
                                        : `\n\n**${
                                            queue.repeatMode === 3
                                                ? embedOptions.icons.autoplaying
                                                : embedOptions.icons.looping
                                        } Looping**\nLoop mode is set to ${loopModeUserString}. You can change it with **\`/loop\`**.`
                                }`
                        )
                        .setThumbnail(skippedTrack.thumbnail)
                        .setColor(embedOptions.colors.success)
                ]
            });
        }
    }
};
