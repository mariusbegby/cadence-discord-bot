import config from 'config';
import { EmbedOptions } from '../../types/configTypes';
const embedOptions: EmbedOptions = config.get('embedOptions');
import { notInVoiceChannel, notInSameVoiceChannel } from '../../utils/validation/voiceChannelValidator';
import { queueDoesNotExist, queueNoCurrentTrack } from '../../utils/validation/queueValidator';
import{ SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { useQueue } from 'discord-player';
import loggerModule from '../../services/logger';
import { CommandParams } from '../../types/commandTypes';

module.exports = {
    isNew: false,
    isBeta: false,
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause or resume the current track.')
        .setDMPermission(false)
        .setNSFW(false),
    execute: async ({ interaction, executionId }: CommandParams) => {
        const logger = loggerModule.child({
            source: 'pause.js',
            module: 'slashCommand',
            name: '/pause',
            executionId: executionId,
            shardId: interaction.guild.shardId,
            guildId: interaction.guild.id
        });

        if (await notInVoiceChannel({ interaction, executionId })) {
            return;
        }

        const queue = useQueue(interaction.guild.id);

        if (await queueDoesNotExist({ interaction, queue, executionId })) {
            return;
        }

        if (await notInSameVoiceChannel({ interaction, queue, executionId })) {
            return;
        }

        if (await queueNoCurrentTrack({ interaction, queue, executionId })) {
            return;
        }

        let durationFormat =
            queue.currentTrack.raw.duration === 0 || queue.currentTrack.duration === '0:00'
                ? ''
                : `\`${queue.currentTrack.duration}\``;

        if (queue.currentTrack.raw.live) {
            durationFormat = `${embedOptions.icons.liveTrack} \`LIVE\``;
        }

        // change paused state to opposite of current state
        queue.node.setPaused(!queue.node.isPaused());
        logger.debug(`Set paused state to ${queue.node.isPaused()}.`);

        logger.debug('Responding with success embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: interaction.member.nickname || interaction.user.username,
                        iconURL: interaction.user.avatarURL()
                    })
                    .setDescription(
                        `**${embedOptions.icons.pauseResumed} ${
                            queue.node.isPaused() ? 'Paused Track' : 'Resumed track'
                        }**\n**${durationFormat} [${queue.currentTrack.title}](${
                            queue.currentTrack.raw.url ?? queue.currentTrack.url
                        })**`
                    )
                    .setThumbnail(queue.currentTrack.thumbnail)
                    .setColor(embedOptions.colors.success)
            ]
        });
    }
};
