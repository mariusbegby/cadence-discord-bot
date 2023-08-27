import config from 'config';
import { EmbedOptions } from '../../types/configTypes';
const embedOptions: EmbedOptions = config.get('embedOptions');
const botOptions: BotOptions = config.get('botOptions');
import { notInVoiceChannel, notInSameVoiceChannel } from '../../utils/validation/voiceChannelValidator';
import { queueDoesNotExist } from '../../utils/validation/queueValidator';
import{ SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { useQueue } from 'discord-player';
import loggerModule from '../../services/logger';
import { CommandParams } from '../../types/commandTypes';

module.exports = {
    isNew: false,
    isBeta: false,
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Toggle looping a track, the whole queue or autoplay.')
        .setDMPermission(false)
        .setNSFW(false)
        .addStringOption((option) =>
            option
                .setName('mode')
                .setDescription('Mode to set for looping.')
                .setRequired(false)
                .addChoices(
                    { name: 'Track', value: '1' },
                    { name: 'Queue', value: '2' },
                    { name: 'Autoplay', value: '3' },
                    { name: 'Disabled', value: '0' }
                )
        ),
    execute: async ({ interaction, executionId }: CommandParams) => {
        const logger = loggerModule.child({
            source: 'loop.js',
            module: 'slashCommand',
            name: '/loop',
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

        const loopModesFormatted = new Map([
            [0, 'disabled'],
            [1, 'track'],
            [2, 'queue'],
            [3, 'autoplay']
        ]);

        const mode = parseInt(interaction.options.getString('mode'));
        const modeUserString = loopModesFormatted.get(mode);
        const currentMode = queue.repeatMode;
        const currentModeUserString = loopModesFormatted.get(currentMode);

        if (!mode && mode !== 0) {
            logger.debug('No mode input was provided, responding with current loop mode.');

            logger.debug('Responding with info embed.');
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${
                                currentMode === 3 ? embedOptions.icons.autoplay : embedOptions.icons.loop
                            } Current loop mode**\nThe looping mode is currently set to \`${currentModeUserString}\`.`
                        )
                        .setColor(embedOptions.colors.info)
                ]
            });
        }

        if (mode === currentMode) {
            logger.debug(`Loop mode is already set to ${modeUserString}.`);

            logger.debug('Responding with warning embed.');
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${embedOptions.icons.warning} Oops!**\nLoop mode is already \`${modeUserString}\`.`
                        )
                        .setColor(embedOptions.colors.warning)
                ]
            });
        }

        queue.setRepeatMode(mode);

        // switch(queue.repeatMode) instead of multiple if statements

        if (queue.repeatMode !== mode) {
            logger.warn(
                'Failed to change loop mode. After setting queue repeat mode, the value was not the same as input.'
            );

            logger.debug('Responding with error embed.');
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${embedOptions.icons.error} Uh-oh... Failed to change loop mode!**\nI tried to change the loop mode to \`${modeUserString}\`, but something went wrong.\n\nYou can try to perform the command again.\n\n_If you think this message is incorrect or the issue persists, please submit a bug report in the **[support server](${botOptions.serverInviteUrl})**._`
                        )
                        .setColor(embedOptions.colors.error)
                        .setFooter({ text: `Execution ID: ${executionId}` })
                ]
            });
        }

        if (queue.repeatMode === 0) {
            logger.debug('Disabled loop mode.');

            logger.debug('Responding with success embed.');
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: interaction.member.nickname || interaction.user.username,
                            iconURL: interaction.user.avatarURL()
                        })
                        .setDescription(
                            `**${embedOptions.icons.success} Loop mode disabled**\nChanging loop mode from **\`${currentModeUserString}\`** to **\`${modeUserString}\`**.\n\nThe ${currentModeUserString} will no longer play on repeat!`
                        )
                        .setColor(embedOptions.colors.success)
                ]
            });
        }

        if (queue.repeatMode === 3) {
            logger.debug('Enabled autoplay mode.');

            logger.debug('Responding with success embed.');
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: interaction.member.nickname || interaction.user.username,
                            iconURL: interaction.user.avatarURL()
                        })
                        .setDescription(
                            `**${embedOptions.icons.autoplaying} Loop mode changed**\nChanging loop mode from **\`${currentModeUserString}\`** to **\`${modeUserString}\`**.\n\nWhen the queue is empty, similar tracks will start playing!`
                        )
                        .setColor(embedOptions.colors.success)
                ]
            });
        }

        logger.debug('Enabled loop mode.');

        logger.debug('Responding with success embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: interaction.member.nickname || interaction.user.username,
                        iconURL: interaction.user.avatarURL()
                    })
                    .setDescription(
                        `**${embedOptions.icons.looping} Loop mode changed**\nChanging loop mode from **\`${currentModeUserString}\`** to **\`${modeUserString}\`**.\n\nThe ${modeUserString} will now play on repeat!`
                    )
                    .setColor(embedOptions.colors.success)
            ]
        });
    }
};
