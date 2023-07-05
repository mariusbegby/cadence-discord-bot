const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a track provided by search terms or URL.')
        .addStringOption((option) =>
            option
                .setName('query')
                .setDescription('Search terms or URL.')
                .setRequired(true)
        ),
    run: async ({ client, interaction, player }) => {
        if (!interaction.member.voice.channel) {
            return interaction.editReply(
                'You need to be in a voice channel to use this command.'
            );
        }

        let query = interaction.options.getString('track');

        try {
            const { track } = await player.play(
                interaction.member.voice.channel,
                query,
                {
                    requestedBy: interaction.user,
                    nodeOptions: {
                        leaveOnEmptyCooldown: 60000,
                        leaveOnEndCooldown: 60000,
                        leaveOnStopCooldown: 60000
                    }
                }
            );

            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: interaction.user.username,
                            iconURL: interaction.user.avatarURL()
                        })
                        .setDescription(
                            `**Added to queue**\n\`[${track.duration}]\` **[${track.title}](${track.url})**`
                        )
                        .setThumbnail(track.thumbnail)
                ]
            });
        } catch (e) {
            console.log(`Error occured while trying to play track:\n\n${e}`);
            throw e;
        }
    }
};
