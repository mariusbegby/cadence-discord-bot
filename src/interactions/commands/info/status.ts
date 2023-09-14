// @ts-ignore
import { version } from '../../../../package.json';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { BaseSlashCommandInteraction } from '../../../classes/interactions';
import { getBotStatistics, getDiscordStatus, getPlayerStatistics, getSystemStatus } from '../../../common/statusUtils';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../../types/interactionTypes';

class StatusCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = new SlashCommandBuilder().setName('status').setDescription('Show operational status of the bot.');
        super(data);
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, interaction, client } = params;
        const logger = this.getLogger(this.name, executionId, interaction);

        const [botStatisticsEmbedString, playerStatisticsEmbedString, systemStatusEmbedString] = await Promise.all([
            getBotStatistics(client!, version),
            getPlayerStatistics(client!),
            getSystemStatus(executionId, false)
        ]);
        const discordStatus = getDiscordStatus(client!);

        logger.debug('Responding with info embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**${this.embedOptions.icons.bot} Bot status**\n` + botStatisticsEmbedString)
                    .addFields(
                        {
                            name: `**${this.embedOptions.icons.queue} Queue status**`,
                            value: playerStatisticsEmbedString
                        },
                        {
                            name: `**${this.embedOptions.icons.server} System status**`,
                            value: systemStatusEmbedString
                        },
                        {
                            name: `**${this.embedOptions.icons.discord} Discord status**`,
                            value: discordStatus
                        }
                    )
                    .setColor(this.embedOptions.colors.info)
            ]
        });
    }
}

export default new StatusCommand();
