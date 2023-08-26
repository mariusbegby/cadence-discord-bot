import config from 'config';
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
    execute: async ({ interaction, client, executionId }) => {
        const logger = require('../../services/logger').child({
            source: 'reload.js',
            module: 'slashCommand',
            name: '/reload',
            executionId: executionId,
            shardId: interaction.guild.shardId,
            guildId: interaction.guild.id
        });

        if (await notValidGuildId({ interaction, executionId })) {
            return;
        }

        try {
            logger.debug('Reloading commands across all shards.');
            await client.shard
                .broadcastEval(
                    async (shardClient, { executionId }) => {
                        shardClient.registerClientCommands({ client: shardClient, executionId });
                    },
                    { context: { executionId: executionId } }
                )
                .then(() => {
                    logger.debug('Successfully reloaded commands across all shards.');
                });
        } catch (error) {
            logger.error(error, 'Failed to reload commands across shards.');

            logger.debug('Responding with error embed.');
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()

                        .setDescription(
                            `**${embedOptions.icons.error} Oops!**\n_Hmm.._ It seems I am unable to reload commands across shards.`
                        )
                        .setColor(embedOptions.colors.error)
                        .setFooter({ text: `Execution ID: ${executionId}` })
                ]
            });
        }

        const commands = client.commands.map((command) => {
            let params = command.data.options[0] ? `**\`${command.data.options[0].name}\`**` + ' ' : '';
            return `- **\`/${command.data.name}\`** ${params}- ${command.data.description}`;
        });

        let embedDescription = `**${embedOptions.icons.bot} Reloaded commands**\n` + commands.join('\n');

        logger.debug('Responding with success embed.');
        return await interaction.editReply({
            embeds: [new EmbedBuilder().setDescription(embedDescription).setColor(embedOptions.colors.success)]
        });
    }
};
