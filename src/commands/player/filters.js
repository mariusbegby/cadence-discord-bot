const logger = require('../../services/logger');
const { embedOptions, ffmpegFilterOptions } = require('../../config');
const { notInVoiceChannel } = require('../../utils/validation/voiceChannelValidation');
const { queueDoesNotExist, queueNoCurrentTrack } = require('../../utils/validation/queueValidation');
const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ButtonBuilder
} = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('filters')
        .setDescription('Toggle various audio filters during playback.')
        .setDMPermission(false),
    execute: async ({ interaction }) => {
        if (await notInVoiceChannel(interaction)) {
            return;
        }

        const queue = useQueue(interaction.guild.id);

        if (await queueDoesNotExist(interaction, queue)) {
            return;
        }

        if (await queueNoCurrentTrack(interaction, queue)) {
            return;
        }

        let filterOptions = [];

        ffmpegFilterOptions.availableFilters.forEach((filter) => {
            let isEnabled = false;

            if (queue.filters.ffmpeg.filters.includes(filter.value)) {
                isEnabled = true;
            }

            filterOptions.push(
                new StringSelectMenuOptionBuilder()
                    .setLabel(filter.label)
                    .setDescription(filter.description)
                    .setValue(filter.value)
                    .setEmoji(filter.emoji)
                    .setDefault(isEnabled)
            );
        });

        const filterSelect = new StringSelectMenuBuilder()
            .setCustomId('filters')
            .setPlaceholder('Select multiple options.')
            .setMinValues(0)
            .setMaxValues(filterOptions.length)
            .addOptions(filterOptions);

        const filterActionRow = new ActionRowBuilder().addComponents(filterSelect);

        const disableFiltersActionRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('disable-filters')
                .setLabel('Disable all filters')
                .setStyle('Secondary')
                .setEmoji(embedOptions.icons.disable)
        );

        const response = await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**Toggle filters** ${embedOptions.icons.beta}\nEnable or disable audio filters for playback from the menu.`
                    )
                    .setColor(embedOptions.colors.info)
            ],
            components: [filterActionRow, disableFiltersActionRow]
        });
        logger.debug(`Sent embed for command ${interaction.commandName}, awaiting interaction response.`);

        const collectorFilter = (i) => i.user.id === interaction.user.id;
        try {
            const confirmation = await response.awaitMessageComponent({
                filter: collectorFilter,
                time: 60000
            });

            logger.debug(`Received interaction response for command ${interaction.commandName}.`);

            confirmation.deferUpdate();

            queue.filters.ffmpeg.setInputArgs([
                '-threads',
                ffmpegFilterOptions.threadAmount,
                '-reconnect',
                '1',
                '-reconnect_streamed',
                '1',
                '-reconnect_delay_max',
                '10',
                '-vn'
            ]);

            // Reset filters before enabling provided filters
            if (queue.filters.ffmpeg.filters.length > 0) {
                queue.filters.ffmpeg.setFilters(false);
            }

            if (confirmation.customId === 'disable-filters' || confirmation.values.length === 0) {
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({
                                name: interaction.member.nickname || interaction.user.username,
                                iconURL: interaction.user.avatarURL()
                            })
                            .setDescription(
                                `**${embedOptions.icons.success} Disabled filters**\nAll audio filters have been disabled.`
                            )
                            .setColor(embedOptions.colors.success)
                    ],
                    components: []
                });
            }

            // Enable provided filters
            queue.filters.ffmpeg.toggle(confirmation.values);

            logger.debug(`Enabled filters ${confirmation.values.join(', ')} for command ${interaction.commandName}.`);

            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: interaction.member.nickname || interaction.user.username,
                            iconURL: interaction.user.avatarURL()
                        })
                        .setDescription(
                            `**${
                                embedOptions.icons.success
                            } Filters toggled**\nNow using these filters:\n${confirmation.values
                                .map(
                                    (enabled) =>
                                        `\`${
                                            ffmpegFilterOptions.availableFilters.find(
                                                (filter) => enabled == filter.value
                                            ).label
                                        }\``
                                )
                                .join(', ')}.`
                        )
                        .setColor(embedOptions.colors.success)
                ],
                components: []
            });
        } catch (error) {
            if (error.code === 'InteractionCollectorError') {
                logger.debug(`Interaction response timed out for command ${interaction.commandName}.`);
                return;
            }

            logger.debug(
                error,
                `Unhandled error while awaiting interaction response for command ${interaction.commandName}, throwing error.`
            );
            throw error;
        }
    }
};
