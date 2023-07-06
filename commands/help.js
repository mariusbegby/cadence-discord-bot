const { SlashCommandBuilder } = require('@discordjs/builders');
const { useMainPlayer, useQueue } = require('discord-player');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Show a list of commands to use.'),
    run: async ({ interaction }) => {
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**List of commands**\n` +
                        `\`/help\` - Show this menu.\n` +
                        `\`/play\` \`query\` - Add a track to the queue by search query or url.\n` +
                        `\`/pause\` - Pause or resume the current track.\n` +
                        `\`/skip\` - Skip the current track.\n` +
                        `\`/leave\` - Remove bot from voice channel and clear queue.\n` +
                        `\`/queue\` - Show the list of tracks added to the queue.\n` +
                        `\`/volume\` \`percentage\` - Show or set the playback volume for tracks.\n`
                    )
                    .setColor('#4c73df')
            ]
        });
    }
};
