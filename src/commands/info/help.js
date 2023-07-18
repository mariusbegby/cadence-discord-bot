const { embedOptions, botOptions } = require('../../config');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Show a list of commands and their usage.')
        .setDMPermission(false),
    execute: async ({ interaction }) => {
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `${embedOptions.icons.rule} **List of commands**\n` +
                            '- **`/play` `query`** - Add a track or playlist to the queue by url or search.\n' +
                            '- **`/pause`** - Pause or resume the current track.\n' +
                            '- **`/queue` `[page]`** - Show the list of tracks added to the queue.\n' +
                            '- **`/nowplaying`** - Show information about the track currently playing.\n' +
                            `- **\`/seek\` \`duration\`** - ${embedOptions.icons.new} Seek to a specified duration in the current track.\n` +
                            `- **\`/loop\` \`mode\`** - ${embedOptions.icons.beta} Toggle looping a track, the whole queue or autoplay.\n` +
                            '- **`/filters`** - Toggle various audio filters during playback.\n' +
                            '- **`/volume` `[percentage]`** - Show or set the playback volume for tracks.\n' +
                            '- **`/skip` `[tracknumber]`** - Skip to next or specified track.\n' +
                            '- **`/remove` `tracknumber`** - Remove specified track from the queue.\n' +
                            '- **`/leave`** - Clear the queue and remove the bot from voice channel.\n\n' +
                            `${embedOptions.icons.support} **Support server**\nJoin the support server for help or suggestions: \n**${botOptions.serverInviteUrl}**\n\n` +
                            `${embedOptions.icons.bot} **Enjoying ${botOptions.name}?**\nAdd me to another server: \n**[Click me!](${botOptions.botInviteUrl})**`
                    )
                    .setColor(embedOptions.colors.info)
            ]
        });
    }
};
