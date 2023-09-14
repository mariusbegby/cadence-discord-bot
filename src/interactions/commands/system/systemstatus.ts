// @ts-ignore
import { dependencies, version } from '../../../../package.json';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { BaseSlashCommandInteraction } from '../../../classes/interactions';
import { getBotStatistics, getDiscordStatus, getPlayerStatistics, getSystemStatus } from '../../../common/statusUtils';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../../types/interactionTypes';
import { checkValidGuildId } from '../../../utils/validation/systemCommandValidator';

class SystemStatusCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = new SlashCommandBuilder()
            .setName('systemstatus')
            .setDescription('Show operational status of the bot with additional technical information.');
        const isSystemCommand: boolean = true;
        super(data, isSystemCommand);
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, interaction, client } = params;
        const logger = this.getLogger(this.name, executionId, interaction);

        await this.runValidators({ interaction, executionId }, [checkValidGuildId]);

        const [botStatisticsEmbedString, playerStatisticsEmbedString, systemStatusEmbedString] = await Promise.all([
            getBotStatistics(client!, version),
            getPlayerStatistics(client!),
            getSystemStatus(executionId, false)
        ]);
        const discordStatusEmbedString = getDiscordStatus(client!);
        const dependenciesEmbedString = this.getDependencies();

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
                            value: discordStatusEmbedString
                        },
                        {
                            name: `**${this.embedOptions.icons.bot} Dependencies**`,
                            value: dependenciesEmbedString
                        }
                    )
                    .setColor(this.embedOptions.colors.info)
            ]
        });
    }

    private getDependencies(): string {
        return (
            `**${dependencies['discord.js']}** discord.js\n` +
            `**┗ ${dependencies['@discordjs/rest']}** @discordjs/rest\n` +
            `**${dependencies['discord-player']}** discord-player\n` +
            `**┗ ${dependencies['@discord-player/opus']}** @discord-player/opus\n` +
            `**┗ ${dependencies['@discord-player/extractor']}** @discord-player/extractor\n` +
            `**${dependencies['discord-voip']}** discord-voip\n` +
            `**${dependencies['mediaplex']}** mediaplex\n` +
            `**${dependencies['youtube-ext']}** youtube-ext`
        );
    }
}

export default new SystemStatusCommand();
