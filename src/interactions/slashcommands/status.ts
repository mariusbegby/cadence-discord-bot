// @ts-ignore
import { version } from '../../../package.json';
import {
    type APIActionRowComponent,
    type APIButtonComponent,
    type APIMessageActionRowComponent,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    EmbedBuilder,
    SlashCommandBuilder
} from 'discord.js';
import { BaseSlashCommandInteraction } from '../../common/classes/interactions';
import {
    getBotStatistics,
    getDiscordStatus,
    getPlayerStatistics,
    getSystemStatus
} from '../../common/utils/statusUtils';
import type { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../types/interactionTypes';
import { localizeCommand, useServerTranslator } from '../../common/utils/localeUtil';

class StatusCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = localizeCommand(new SlashCommandBuilder().setName('status'));
        super(data);
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, interaction, client } = params;
        const logger = this.getLogger(this.name, executionId, interaction);
        const translator = useServerTranslator(interaction);

        await interaction.deferReply();
        logger.debug('Interaction deferred.');

        const [botStatisticsEmbedString, playerStatisticsEmbedString, systemStatusEmbedString] = await Promise.all([
            getBotStatistics(client!, version, translator),
            getPlayerStatistics(client!, translator),
            getSystemStatus(executionId, translator)
        ]);
        const discordStatusEmbedString = getDiscordStatus(client!, translator);

        const components: APIMessageActionRowComponent[] = [];
        if (this.botOptions.openSourceUrl && this.botOptions.openSourceUrl !== '') {
            const openSourceButton: APIButtonComponent = new ButtonBuilder()
                .setURL(this.botOptions.openSourceUrl)
                .setStyle(ButtonStyle.Link)
                .setEmoji(this.embedOptions.icons.openSource)
                .setLabel(translator('commands.status.openSourceButtonLabel'))
                .toJSON();
            components.push(openSourceButton);
        }

        const embedActionRow: APIActionRowComponent<APIMessageActionRowComponent> = {
            type: ComponentType.ActionRow,
            components
        };

        logger.debug('Responding with info embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `${translator('statistics.botStatus.title', { icon: this.embedOptions.icons.bot })}\n${botStatisticsEmbedString}`
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
            ],
            components: components.length > 0 ? [embedActionRow] : []
        });
    }
}

export default new StatusCommand();
