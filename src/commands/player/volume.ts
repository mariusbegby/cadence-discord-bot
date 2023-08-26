const config = require('config');
const embedOptions = config.get('embedOptions');
const { notInVoiceChannel, notInSameVoiceChannel } = require('../../utils/validation/voiceChannelValidator');
const { queueDoesNotExist } = require('../../utils/validation/queueValidator');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    isNew: false,
    isBeta: false,
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Show or set the playback volume for tracks.')
        .setDMPermission(false)
        .setNSFW(false)
        .addNumberOption((option) =>
            option
                .setName('percentage')
                .setDescription('Set volume percentage from 1% to 100%.')
                .setMinValue(0)
                .setMaxValue(100)
        ),
    execute: async ({ interaction, executionId }) => {
        const logger = require('../../services/logger').child({
            source: 'volume.js',
            module: 'slashCommand',
            name: '/volume',
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

        const volume = interaction.options.getNumber('percentage');

        if (!volume && volume !== 0) {
            const currentVolume = queue.node.volume;

            logger.debug('No volume input was provided, showing current volume.');

            logger.debug('Responding with info embed.');
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${
                                currentVolume === 0 ? embedOptions.icons.volumeIsMuted : embedOptions.icons.volume
                            } Playback volume**\nThe playback volume is currently set to \`${currentVolume}%\`.`
                        )
                        .setColor(embedOptions.colors.info)
                ]
            });
        } else if (volume > 100 || volume < 0) {
            logger.debug('Volume specified was higher than 100% or lower than 0%.');

            logger.debug('Responding with warning embed.');
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${embedOptions.icons.warning} Oops!**\nYou cannot set the volume to \`${volume}\`, please pick a value betwen \`1\`% and \`100\`%.`
                        )
                        .setColor(embedOptions.colors.warning)
                ]
            });
        } else {
            queue.node.setVolume(volume);
            logger.debug(`Set volume to ${volume}%.`);

            if (volume === 0) {
                logger.debug('Responding with success embed.');
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({
                                name: interaction.member.nickname || interaction.user.username,
                                iconURL: interaction.user.avatarURL()
                            })
                            .setDescription(
                                `**${embedOptions.icons.volumeMuted} Audio muted**\nPlayback audio has been muted, because volume was set to \`${volume}%\`.`
                            )
                            .setColor(embedOptions.colors.success)
                    ]
                });
            }

            logger.debug('Responding with success embed.');
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: interaction.member.nickname || interaction.user.username,
                            iconURL: interaction.user.avatarURL()
                        })
                        .setDescription(
                            `**${embedOptions.icons.volumeChanged} Volume changed**\nPlayback volume has been changed to \`${volume}%\`.`
                        )
                        .setColor(embedOptions.colors.success)
                ]
            });
        }
    }
};
