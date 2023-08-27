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
        .setName('seek')
        .setDescription('Seek to a specified duration in the current track.')
        .setDMPermission(false)
        .setNSFW(false)
        .addStringOption((option) =>
            option
                .setName('duration')
                .setDescription('Duration in format 00:00:00 (HH:mm:ss) to seek to.')
                .setRequired(true)
        ),
    execute: async ({ interaction, executionId }: CommandParams) => {
        const logger = loggerModule.child({
            source: 'seek.js',
            module: 'slashCommand',
            name: '/seek',
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

        const durationInput = interaction.options.getString('duration');

        let durationArray = durationInput!.split(':');

        switch (durationArray.length) {
            case 1:
                durationArray.unshift('00', '00');
                break;
            case 2:
                durationArray.unshift('00');
                break;
            default:
                break;
        }

        durationArray = durationArray.map((value) => {
            return value.padStart(2, '0');
        });

        const durationString = durationArray.join(':');

        if (durationArray.length === 0 || durationArray.length > 3) {
            logger.debug('Invalid duration format input.');

            logger.debug('Responding with warning embed.');
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${embedOptions.icons.warning} Oops!**\nYou entered an invalid duration format, **\`${durationString}\`**.\n\nPlease use the format **\`HH:mm:ss\`**, **\`mm:ss\`** or **\`ss\`**, where **\`HH\`** is hours, **\`mm\`** is minutes and **\`ss\`** is seconds.\n\n**Examples:**\n` +
                                '- **`/seek`** **`1:24:12`** - Seek to 1 hour, 24 minutes and 12 seconds.\n' +
                                '- **`/seek`** **`3:27`** - Seek to 3 minutes and 27 seconds.\n' +
                                '- **`/seek`** **`42`** - Seek to 42 seconds.'
                        )
                        .setColor(embedOptions.colors.warning)
                ]
            });
        }

        const validElements = durationArray.every((value) => {
            return value.length === 2;
        });

        if (!validElements) {
            logger.debug('Invalid duration after parsing duration input.');

            logger.debug('Responding with warning embed.');
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${embedOptions.icons.warning} Oops!**\nYou entered an invalid duration format, **\`${durationString}\`**.\n\nPlease use the format **\`HH:mm:ss\`**, **\`mm:ss\`** or **\`ss\`**, where **\`HH\`** is hours, **\`mm\`** is minutes and **\`ss\`** is seconds.\n\n**Examples:**\n` +
                                '- **`/seek`** **`1:24:12`** - Seek to 1 hour, 24 minutes and 12 seconds.\n' +
                                '- **`/seek`** **`3:27`** - Seek to 3 minutes and 27 seconds.\n' +
                                '- **`/seek`** **`42`** - Seek to 42 seconds.'
                        )
                        .setColor(embedOptions.colors.warning)
                ]
            });
        }

        // Now array should only be 3 elements long, all with 2 characters, e.g. ['00', '00', '00'].
        // Regex can now validate if this is a valid duration format. E.g. check if the first element is 0-23, second element is 0-59 and third element is 0-59.
        const regex = new RegExp('([0-1][0-9]|2[0-3]):?[0-5][0-9]:?[0-5][0-9]');
        const isValidDuration = regex.test(durationString);

        if (!isValidDuration) {
            logger.debug('Invalid duration after regex checks.');

            logger.debug('Responding with warning embed.');
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${embedOptions.icons.warning} Oops!**\nYou entered an invalid duration format, **\`${durationString}\`**.\n\nPlease use the format **\`HH:mm:ss\`**, **\`mm:ss\`** or **\`ss\`**, where **\`HH\`** is hours, **\`mm\`** is minutes and **\`ss\`** is seconds.\n\n**Examples:**\n` +
                                '- **`/seek`** **`1:24:12`** - Seek to 1 hour, 24 minutes and 12 seconds.\n' +
                                '- **`/seek`** **`3:27`** - Seek to 3 minutes and 27 seconds.\n' +
                                '- **`/seek`** **`42`** - Seek to 42 seconds.'
                        )
                        .setColor(embedOptions.colors.warning)
                ]
            });
        }

        const currentTrackMaxDurationInMs = queue.currentTrack!.durationMS;
        const durationInMilliseconds: number =
            Number(durationArray[0]) * 3600000 + Number(durationArray[1]) * 60000 + Number(durationArray[2]) * 1000;

        if (durationInMilliseconds > currentTrackMaxDurationInMs - 1000) {
            logger.debug('Duration specified is longer than the track duration.');

            logger.debug('Responding with warning embed.');
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${
                                embedOptions.icons.warning
                            } Oops!**\nYou entered **\`${durationString}\`**, which is a duration that is longer than the duration for the current track.\n\nPlease try a duration that is less than the duration of the track (**\`${
                                queue.currentTrack!.duration
                            }\`**).`
                        )
                        .setColor(embedOptions.colors.warning)
                ]
            });
        }

        queue.node.seek(durationInMilliseconds);
        logger.debug(`Seeked to '${durationString}' in current track.`);

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
                        `**${embedOptions.icons.success} Seeking to duration**\nSeeking to **\`${durationString}\`** in current track.`
                    )
                    .setThumbnail(queue.currentTrack!.thumbnail)
                    .setColor(embedOptions.colors.success)
            ]
        });
    }
};
