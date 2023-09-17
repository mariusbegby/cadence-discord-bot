// @ts-ignore
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { BaseSlashCommandInteraction } from '../../../classes/interactions';
import { getBotStatistics, getDiscordStatus, getPlayerStatistics, getSystemStatus } from '../../../common/statusUtils';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../../types/interactionTypes';

class StatusCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = new SlashCommandBuilder().setName('status').setDescription('Menampilkan status operasional bot');
        super(data);
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, interaction, client } = params;
        const logger = this.getLogger(this.name, executionId, interaction);
        const [botStatisticsEmbedString, playerStatisticsEmbedString, systemStatusEmbedString] = await Promise.all([
            getBotStatistics(client!),
            getPlayerStatistics(client!),
            getSystemStatus(executionId, false)
        ]);
        const discordStatus = getDiscordStatus(client!);

        logger.debug('Responding with info embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .addFields(
                        {
                            name: `**${this.embedOptions.icons.nyctophileZuiRobot} Bot Status**`,
                            value: botStatisticsEmbedString,
                            inline: true
                        },
                        {
                            name: `**${this.embedOptions.icons.queue} Queue Status**`,
                            value: playerStatisticsEmbedString,
                            inline: true
                        },
                        { name: '\u200B', value: '\u200B' },
                        {
                            name: `**${this.embedOptions.icons.nyctophileZuiServer} System Status**`,
                            value: systemStatusEmbedString,
                            inline: true
                        },
                        {
                            name: `**${this.embedOptions.icons.nyctophileZuiGlobe} Discord Status**`,
                            value: discordStatus,
                            inline: true
                        }
                    )
                    .setColor(this.embedOptions.colors.info)
            ]
        });
    }
}

export default new StatusCommand();
