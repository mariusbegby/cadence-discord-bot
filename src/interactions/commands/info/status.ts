// @ts-ignore
import { version } from '../../../../package.json';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { BaseSlashCommandInteraction } from '../../../classes/interactions';
import { getBotStatistics, getDiscordStatus, getPlayerStatistics, getSystemStatus } from '../../../common/statusUtils';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../../types/interactionTypes';
import { localizeCommand, useServerTranslator } from '../../../common/localeUtil';

class StatusCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = localizeCommand(new SlashCommandBuilder().setName('status'));
        super(data);
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, interaction, client } = params;
        const logger = this.getLogger(this.name, executionId, interaction);
        const translator = useServerTranslator(interaction);

        const [botStatisticsEmbedString, playerStatisticsEmbedString, systemStatusEmbedString] = await Promise.all([
            getBotStatistics(client!, version, translator),
            getPlayerStatistics(client!, translator),
            getSystemStatus(executionId, false, translator)
        ]);
        const discordStatusEmbedString = getDiscordStatus(client!, translator);

        logger.debug('Responding with info embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        translator('statistics.botStatus.title', { icon: this.embedOptions.icons.bot }) +
                            '\n' +
                            botStatisticsEmbedString
                    )
                    .addFields(
                        {
                            name: translator('statistics.queueStatus.title', {
                                icon: this.embedOptions.icons.queue
                            }),
                            value: playerStatisticsEmbedString
                        },
                        {
                            name: translator('statistics.systemStatus.title', {
                                icon: this.embedOptions.icons.server
                            }),
                            value: systemStatusEmbedString
                        },
                        {
                            name: translator('statistics.discordStatus.title', {
                                icon: this.embedOptions.icons.discord
                            }),
                            value: discordStatusEmbedString
                        }
                    )
                    .setColor(this.embedOptions.colors.info)
            ]
        });
    }
}

export default new StatusCommand();
