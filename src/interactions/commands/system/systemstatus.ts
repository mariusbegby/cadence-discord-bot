import { EmbedBuilder, Guild, SlashCommandBuilder } from 'discord.js';
import osu from 'node-os-utils';
// @ts-ignore
import { dependencies, version } from '../../../../package.json';
import {
    BaseSlashCommandInteraction,
    BaseSlashCommandParams,
    BaseSlashCommandReturnType
} from '../../../types/interactionTypes';
import { getUptimeFormatted } from '../../../utils/system/getUptimeFormatted';
import { notValidGuildId } from '../../../utils/validation/systemCommandValidator';

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

        if (await notValidGuildId({ interaction, executionId })) {
            return;
        }

        // from normal /status command
        const uptimeString: string = await getUptimeFormatted({ executionId });
        const usedMemoryInMB: string = Math.ceil((await osu.mem.info()).usedMemMb).toLocaleString('en-US');
        const cpuUsage: number = await osu.cpu.usage();
        const releaseVersion: string = version;
        let guildCount: number = 0;
        let memberCount: number = 0;
        let activeVoiceConnections: number = 0;
        let totalTracks: number = 0;
        let totalListeners: number = 0;

        // specific to /systemstatus command
        const totalMemoryInMb: string = Math.ceil((await osu.mem.info()).totalMemMb).toLocaleString('en-US');
        const cpuCores: number = await osu.cpu.count();
        const platform: string = await osu.os.platform();
        const discordJsVersion: string = dependencies['discord.js'];
        const opusVersion: string = dependencies['@discord-player/opus'];
        const restVersion: string = dependencies['@discordjs/rest'];
        const voiceVersion: string = dependencies['discord-voip'];
        const discordPlayerVersion: string = dependencies['discord-player'];
        const extractorVersion: string = dependencies['@discord-player/extractor'];
        const mediaplexVersion: string = dependencies['mediaplex'];
        const distubeYtdlVersion: string = dependencies['@distube/ytdl-core'];

        logger.debug('Fetching player statistics from all shards.');

        await client!
            .shard!.broadcastEval(() => {
                /* eslint-disable no-undef */
                return player.generateStatistics();
            })
            .then((results) => {
                results.map((result) => {
                    activeVoiceConnections += result.queues.length;
                    result.queues.map((queue) => {
                        totalTracks += queue.status.playing ? queue.tracksCount + 1 : queue.tracksCount;
                        totalListeners += queue.listeners;
                    });
                });

                logger.debug('Successfully fetched player statistics from shards.');
            })
            .catch((error) => {
                logger.error(error, 'Failed to fetch player statistics from shards.');
            });

        logger.debug('Fetching client values from all shards.');
        await client!
            .shard!.fetchClientValues('guilds.cache')
            .then((results) => {
                const guildCaches: Guild[][] = results as Guild[][];
                guildCaches.map((guildCache: Guild[]) => {
                    if (guildCache) {
                        guildCount += guildCache.length;
                        memberCount += guildCache.reduce((acc: number, guild: Guild) => acc + guild.memberCount, 0);
                    }
                });
                logger.debug('Successfully fetched client values from shards.');
            })
            .catch((error) => {
                logger.error(error, 'Failed to fetch client values from shards.');
            });

        const botStatusString =
            `**${guildCount.toLocaleString('en-US')}** Joined servers\n` +
            `**${memberCount.toLocaleString('en-US')}** Total members\n` +
            `**v${releaseVersion}** Release version`;

        const queueStatusString =
            `**${activeVoiceConnections.toLocaleString('en-US')}** Voice connections\n` +
            `**${totalTracks.toLocaleString('en-US')}** Tracks in queues\n` +
            `**${totalListeners.toLocaleString('en-US')}** Users listening`;

        const systemStatusString =
            `**${platform}** Platform\n` +
            `**${uptimeString}** Uptime\n` +
            `**${cpuUsage}% @ ${cpuCores} cores** CPU usage\n` +
            `**${usedMemoryInMB} / ${totalMemoryInMb} MB** Memory usage`;

        const dependenciesString =
            `**${discordJsVersion}** discord.js\n` +
            `**┗ ${restVersion}** @discordjs/rest\n` +
            `**${discordPlayerVersion}** discord-player\n` +
            `**┗ ${opusVersion}** @discord-player/opus\n` +
            `**┗ ${extractorVersion}** @discord-player/extractor\n` +
            `**${voiceVersion}** discord-voip\n` +
            `**${mediaplexVersion}** mediaplex\n` +
            `**${distubeYtdlVersion}** @distube/ytdl-core`;

        const discordStatusString: string = `**${client!.ws.ping} ms** Discord API latency`;

        logger.debug('Transformed system status into embed description.');

        logger.debug('Responding with info embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**${this.embedOptions.icons.bot} Bot status**\n` + botStatusString)
                    .addFields(
                        {
                            name: `**${this.embedOptions.icons.queue} Queue status**`,
                            value: queueStatusString,
                            inline: false
                        },
                        {
                            name: `**${this.embedOptions.icons.server} System status**`,
                            value: systemStatusString,
                            inline: false
                        },
                        {
                            name: `**${this.embedOptions.icons.discord} Discord status**`,
                            value: discordStatusString,
                            inline: false
                        },
                        {
                            name: `**${this.embedOptions.icons.bot} Dependencies**`,
                            value: dependenciesString,
                            inline: false
                        }
                    )
                    .setColor(this.embedOptions.colors.info)
            ]
        });
    }
}

export default new SystemStatusCommand();
