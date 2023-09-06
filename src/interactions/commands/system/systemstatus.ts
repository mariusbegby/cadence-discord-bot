import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import osu from 'node-os-utils';
// @ts-ignore
import { dependencies, version } from '../../../../package.json';
import { BaseSlashCommandInteraction } from '../../../classes/interactions';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../../types/interactionTypes';
import { fetchTotalGuildStatistics, fetchTotalPlayerStatistics } from '../../../utils/shardUtils';
import { getUptimeFormatted } from '../../../utils/system/getUptimeFormatted';
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

        // from normal /status command
        const uptimeString: string = await getUptimeFormatted({ executionId });
        const usedMemoryInMB: string = Math.ceil((await osu.mem.info()).usedMemMb).toLocaleString('en-US');
        const cpuUsage: number = await osu.cpu.usage();
        const releaseVersion: string = version;
        const { totalGuildCount, totalMemberCount } = await fetchTotalGuildStatistics(client);
        const { totalVoiceConnections, totalTracksInQueues, totalListeners } = await fetchTotalPlayerStatistics(client);

        // specific to /systemstatus command
        const totalMemoryInMb: string = Math.ceil((await osu.mem.info()).totalMemMb).toLocaleString('en-US');
        const cpuCores: number = osu.cpu.count();
        const platform: string = osu.os.platform();
        const discordJsVersion: string = dependencies['discord.js'];
        const opusVersion: string = dependencies['@discord-player/opus'];
        const restVersion: string = dependencies['@discordjs/rest'];
        const voiceVersion: string = dependencies['discord-voip'];
        const discordPlayerVersion: string = dependencies['discord-player'];
        const extractorVersion: string = dependencies['@discord-player/extractor'];
        const mediaplexVersion: string = dependencies['mediaplex'];
        const distubeYtdlVersion: string = dependencies['@distube/ytdl-core'];

        logger.debug('Fetching player statistics from all shards.');

        const botStatisticsEmbedString =
            `**${totalGuildCount.toLocaleString('en-US')}** Joined servers\n` +
            `**${totalMemberCount.toLocaleString('en-US')}** Total members\n` +
            `**v${releaseVersion}** Release version`;

        const playerStatisticsEmbedString =
            `**${totalVoiceConnections.toLocaleString('en-US')}** Voice connections\n` +
            `**${totalTracksInQueues.toLocaleString('en-US')}** Tracks in queues\n` +
            `**${totalListeners.toLocaleString('en-US')}** Users listening`;

        const systemStatusEmbedString =
            `**${platform}** Platform\n` +
            `**${uptimeString}** Uptime\n` +
            `**${cpuUsage}% @ ${cpuCores} cores** CPU usage\n` +
            `**${usedMemoryInMB} / ${totalMemoryInMb} MB** Memory usage`;

        const dependenciesEmbedString =
            `**${discordJsVersion}** discord.js\n` +
            `**┗ ${restVersion}** @discordjs/rest\n` +
            `**${discordPlayerVersion}** discord-player\n` +
            `**┗ ${opusVersion}** @discord-player/opus\n` +
            `**┗ ${extractorVersion}** @discord-player/extractor\n` +
            `**${voiceVersion}** discord-voip\n` +
            `**${mediaplexVersion}** mediaplex\n` +
            `**${distubeYtdlVersion}** @distube/ytdl-core`;

        const discordWebsocketPingEmbedString: string = `**${client!.ws.ping} ms** Discord API latency`;

        logger.debug('Transformed system status into embed description.');

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
}

export default new SystemStatusCommand();
