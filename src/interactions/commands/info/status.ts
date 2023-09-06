import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import osu from 'node-os-utils';
// @ts-ignore
import { version } from '../../../../package.json';
import { BaseSlashCommandInteraction } from '../../../classes/interactions';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../../types/interactionTypes';
import { fetchTotalGuildStatistics, fetchTotalPlayerStatistics } from '../../../utils/shardUtils';
import { getUptimeFormatted } from '../../../utils/system/getUptimeFormatted';

class StatusCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = new SlashCommandBuilder().setName('status').setDescription('Show operational status of the bot.');
        super(data);
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, interaction, client } = params;
        const logger = this.getLogger(this.name, executionId, interaction);

        const uptimeString: string = await getUptimeFormatted({ executionId });
        const usedMemoryInMB: string = Math.ceil((await osu.mem.info()).usedMemMb).toLocaleString('en-US');
        const cpuUsage: number = await osu.cpu.usage();
        const releaseVersion: string = version;
        const { totalGuildCount, totalMemberCount } = await fetchTotalGuildStatistics(client);
        const { totalVoiceConnections, totalTracksInQueues, totalListeners } = await fetchTotalPlayerStatistics(client);

        const botStatisticsEmbedString =
            `**${totalGuildCount.toLocaleString('en-US')}** Joined servers\n` +
            `**${totalMemberCount.toLocaleString('en-US')}** Total members\n` +
            `**v${releaseVersion}** Release version`;

        const playerStatisticsEmbedString =
            `**${totalVoiceConnections.toLocaleString('en-US')}** Voice connections\n` +
            `**${totalTracksInQueues.toLocaleString('en-US')}** Tracks in queues\n` +
            `**${totalListeners.toLocaleString('en-US')}** Users listening`;

        const systemStatusEmbedString =
            `**${uptimeString}** Uptime\n` + `**${cpuUsage}%** CPU usage\n` + `**${usedMemoryInMB} MB** Memory usage`;

        const discordWebsocketPingEmbedString: string = `**${client!.ws.ping} ms** Discord API latency`;

        logger.debug('Transformed status info into embed description.');

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
                            value: discordWebsocketPingEmbedString
                        }
                    )
                    .setColor(this.embedOptions.colors.info)
            ]
        });
    }
}

export default new StatusCommand();
