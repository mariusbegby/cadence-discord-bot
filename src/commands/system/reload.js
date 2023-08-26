const logger = require('../../services/logger');
const config = require('config');
const embedOptions = config.get('embedOptions');
const { notValidGuildId } = require('../../utils/validation/systemCommandValidator');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    isSystemCommand: true,
    isNew: false,
    isBeta: false,
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reload the bot commands.')
        .setDMPermission(false)
        .setNSFW(false),
    execute: async ({ interaction, client }) => {
        if (await notValidGuildId(interaction)) {
            logger.debug('Not a valid guild id.');
            return;
        }

        try {
            await client.shard
                .broadcastEval((shardClient) => {
                    shardClient.registerClientCommands(shardClient);
                })
                .then(() => {
                    logger.info('Reloaded commands across all shards.');
                });
        } catch (error) {
            logger.error(error, 'Failed to reload commands.');
        }

        const commands = client.commands.map((command) => {
            let params = command.data.options[0] ? `**\`${command.data.options[0].name}\`**` + ' ' : '';
            return `- **\`/${command.data.name}\`** ${params}- ${command.data.description}`;
        });

        let embedDescription = `**${embedOptions.icons.bot} Reloaded commands**\n` + commands.join('\n');

        return await interaction.editReply({
            embeds: [new EmbedBuilder().setDescription(embedDescription).setColor(embedOptions.colors.success)]
        });
    }
};
