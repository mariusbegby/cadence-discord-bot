const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { embedColors } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Show a list of commands and their usage.'),
    run: async ({ interaction }) => {
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        '**List of commands**\n' +
                            '`/help` - Show this menu.\n' +
                            '`/play` `query` - Add a track or playlist to the queue by searching or url.\n' +
                            '`/pause` - Pause or resume the current track.\n' +
                            '`/queue` `[page]` - Show the list of tracks added to the queue.\n' +
                            '`/nowplaying` - Show information about the track currently playing.\n' +
                            '`/filters` - Toggle various audio filters during playback.\n' +
                            '`/volume` `[percentage]` - Show or set the playback volume for tracks.\n' +
                            '`/skip` `[trackNumber]` - Skip the current track.\n' +
                            '`/remove` `trackNumber` - Remove a specific track from the queue.\n' +
                            '`/leave` - Remove bot from voice channel and clear the queue.\n'
                    )
                    .setColor(embedColors.colorInfo)
            ]
        });
    }
};
