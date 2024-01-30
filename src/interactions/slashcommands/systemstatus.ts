// @ts-ignore
import { dependencies, version } from '../../../package.json';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { BaseSlashCommandInteraction } from '../../common/classes/interactions';
import {
    getBotStatistics,
    getDiscordStatus,
    getPlayerStatistics,
    getSystemStatus
} from '../../common/utils/statusUtils';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../types/interactionTypes';
import { checkValidGuildId } from '../../common/validation/systemCommandValidator';
import { localizeCommand, useServerTranslator } from '../../common/utils/localeUtil';

class SystemStatusCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = localizeCommand(new SlashCommandBuilder().setName('systemstatus'));
        const isSystemCommand: boolean = true;
        super(data, isSystemCommand);
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, interaction, client } = params;
        const logger = this.getLogger(this.name, executionId, interaction);
        const translator = useServerTranslator(interaction);

        await this.runValidators({ interaction, executionId }, [checkValidGuildId]);

        await interaction.deferReply();
        logger.debug('Interaction deferred.');

        const [botStatisticsEmbedString, playerStatisticsEmbedString, systemStatusEmbedString] = await Promise.all([
            getBotStatistics(client!, version, translator),
            getPlayerStatistics(client!, translator),
            getSystemStatus(executionId, false, translator)
        ]);
        const discordStatusEmbedString = getDiscordStatus(client!, translator);
        const dependenciesEmbedString = this.getDependencies();

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
                        },
                        {
                            name: translator('statistics.dependencies.title', {
                                icon: this.embedOptions.icons.bot
                            }),
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
