const { SlashCommandBuilder } = require('@discordjs/builders');
const { useMainPlayer, useQueue } = require('discord-player');
const {
    EmbedBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder,
    ButtonBuilder
} = require('discord.js');
const {
    embedColors,
    filterList,
    filterThreadAmount
} = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('filters')
        .setDescription('Toggle various audio filters during playback.'),
    run: async ({ interaction }) => {
        if (!interaction.member.voice.channel) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**Failed**\nYou need to be in a voice channel to use this command.`
                        )
                        .setColor(embedColors.colorWarning)
                ]
            });
        }

        const queue = await useQueue(interaction.guild.id);

        if (!queue) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**Failed**\nThere are no tracks in the queue.`
                        )
                        .setColor(embedColors.colorWarning)
                ]
            });
        }

        let filterOptions = [];

        filterList.forEach((filter) => {
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

        const filterActionRow = new ActionRowBuilder().addComponents(
            filterSelect
        );

        const disableFiltersActionRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('disable-filters')
                .setLabel('Disable all filters')
                .setStyle('Secondary')
        );

        const response = await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**Toggle filters** (beta)\nToggle or disable audio filters for playback.`
                    )
                    .setColor(embedColors.colorInfo)
            ],
            components: [filterActionRow, disableFiltersActionRow]
        });

        const collectorFilter = (i) => i.user.id === interaction.user.id;
        try {
            const confirmation = await response.awaitMessageComponent({
                filter: collectorFilter,
                time: 60000
            });

            console.log(confirmation.values);
            queue.filters.ffmpeg.setInputArgs([
                '-threads',
                filterThreadAmount,
                '-reconnect',
                '1',
                '-reconnect_streamed',
                '1',
                '-reconnect_delay_max',
                '5',
                '-vn'
            ]);

            // Reset filters before enabling provided filters
            if (queue.filters.ffmpeg.filters.length > 0) {
                queue.filters.ffmpeg.setFilters(false);
            }

            if (
                confirmation.customId === 'disable-filters' ||
                confirmation.values.length === 0
            ) {
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({
                                name: interaction.user.username,
                                iconURL: interaction.user.avatarURL()
                            })
                            .setDescription(
                                `**Disabled filters**\nDisabled all audio filters.`
                            )
                            .setColor(embedColors.colorSuccess)
                    ],
                    components: []
                });
            }

            // Enable provided filters
            queue.filters.ffmpeg.toggle(confirmation.values);

            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: interaction.user.username,
                            iconURL: interaction.user.avatarURL()
                        })
                        .setDescription(
                            `**Filters enabled**\nThese filters are now enabled:\n${confirmation.values
                                .map(
                                    (enabled) =>
                                        `\`${
                                            filterList.find(
                                                (filter) =>
                                                    enabled == filter.value
                                            ).label
                                        }\``
                                )
                                .join(', ')}`
                        )
                        .setColor(embedColors.colorSuccess)
                ],
                components: []
            });
        } catch (e) {
            console.log(e);
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**Cancelled**\nNo confirmation received within 1 minute.`
                        )
                        .setColor(embedColors.colorWarning)
                ],
                components: []
            });
        }
    }
};
