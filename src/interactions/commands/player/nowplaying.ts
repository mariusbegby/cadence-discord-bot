import config from 'config';
import { GuildQueue, PlayerTimestamp, Track, useQueue } from 'discord-player';
import {
    APIActionRowComponent,
    APIButtonComponent,
    APIMessageActionRowComponent,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    EmbedBuilder,
    SlashCommandBuilder
} from 'discord.js';
import { PlayerOptions } from '../../../types/configTypes';
import {
    BaseSlashCommandInteraction,
    BaseSlashCommandParams,
    BaseSlashCommandReturnType,
    TrackMetadata
} from '../../../types/interactionTypes';
import { queueDoesNotExist, queueNoCurrentTrack } from '../../../utils/validation/queueValidator';
import { notInSameVoiceChannel, notInVoiceChannel } from '../../../utils/validation/voiceChannelValidator';

const playerOptions: PlayerOptions = config.get('playerOptions');

class NowPlayingCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = new SlashCommandBuilder()
            .setName('nowplaying')
            .setDescription('Show information about the current track.');
        super(data);
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, interaction } = params;
        const logger = this.getLogger(this.name, executionId, interaction);

        const queue: GuildQueue = useQueue(interaction.guild!.id)!;

        // TODO: define TS type/interface for validators
        const validators = [
            () => notInVoiceChannel({ interaction, executionId }),
            () => notInSameVoiceChannel({ interaction, queue, executionId }),
            () => queueDoesNotExist({ interaction, queue, executionId }),
            () => queueNoCurrentTrack({ interaction, queue, executionId })
        ];

        for (const validator of validators) {
            if (await validator()) {
                return;
            }
        }

        const sourceStringsFormatted: Map<string, string> = new Map([
            ['youtube', 'YouTube'],
            ['soundcloud', 'SoundCloud'],
            ['spotify', 'Spotify'],
            ['apple_music', 'Apple Music'],
            ['arbitrary', 'Direct source']
        ]);

        const sourceIcons: Map<string, string> = new Map([
            ['youtube', this.embedOptions.icons.sourceYouTube],
            ['soundcloud', this.embedOptions.icons.sourceSoundCloud],
            ['spotify', this.embedOptions.icons.sourceSpotify],
            ['apple_music', this.embedOptions.icons.sourceAppleMusic],
            ['arbitrary', this.embedOptions.icons.sourceArbitrary]
        ]);

        const currentTrack: Track = queue.currentTrack!;

        let author: string = currentTrack.author ? currentTrack.author : 'Unavailable';
        if (author === 'cdn.discordapp.com') {
            author = 'Unavailable';
        }
        const plays: number = currentTrack.views !== 0 ? currentTrack.views : 0;

        let displayPlays: string = plays.toLocaleString('en-US');

        const metadata: TrackMetadata = currentTrack.metadata as TrackMetadata;

        if (plays === 0 && metadata.bridge && metadata.bridge.views !== 0 && metadata.bridge.views !== undefined) {
            displayPlays = metadata.bridge.views.toLocaleString('en-US');
        } else if (plays === 0) {
            displayPlays = 'Unavailable';
        }

        const source: string = sourceStringsFormatted.get(currentTrack.raw.source!) ?? 'Unavailable';
        const queueLength: number = queue.tracks.data.length;
        const timestamp: PlayerTimestamp = queue.node.getTimestamp()!;
        let bar: string = `**\`${timestamp.current.label}\`** ${queue.node.createProgressBar({
            queue: false,
            length: playerOptions.progressBar.length ?? 12,
            timecodes: playerOptions.progressBar.timecodes ?? false,
            indicator: playerOptions.progressBar.indicator ?? '🔘',
            leftChar: playerOptions.progressBar.leftChar ?? '▬',
            rightChar: playerOptions.progressBar.rightChar ?? '▬'
        })} **\`${timestamp.total.label}\`**`;

        if (Number(currentTrack.raw.duration) === 0 || currentTrack.duration === '0:00') {
            bar = '_No duration available._';
        }

        if (currentTrack.raw.live) {
            bar = `${this.embedOptions.icons.liveTrack} **\`LIVE\`** - Playing continuously from live source.`;
        }

        const customId: string = `nowplaying-skip-button_${currentTrack.id}`;
        logger.debug(`Generated custom id for skip button: ${customId}`);

        const nowPlayingButton: APIButtonComponent = new ButtonBuilder()
            .setCustomId(customId)
            .setLabel('Skip track')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(this.embedOptions.icons.nextTrack)
            .toJSON();

        const nowPlayingActionRow: APIActionRowComponent<APIMessageActionRowComponent> = {
            type: ComponentType.ActionRow,
            components: [nowPlayingButton]
        };

        const loopModesFormatted: Map<number, string> = new Map([
            [0, 'disabled'],
            [1, 'track'],
            [2, 'queue'],
            [3, 'autoplay']
        ]);

        const loopModeUserString: string = loopModesFormatted.get(queue.repeatMode)!;

        logger.debug('Successfully retrieved information about the current track.');

        logger.debug('Sending info embed with action row components.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: `Channel: ${queue.channel!.name} (${queue.channel!.bitrate / 1000}kbps)`,
                        iconURL: interaction.guild!.iconURL() || this.embedOptions.info.fallbackIconUrl
                    })
                    .setDescription(
                        (queue.node.isPaused()
                            ? '**Currently Paused**\n'
                            : `**${this.embedOptions.icons.audioPlaying} Now Playing**\n`) +
                            `**[${currentTrack.title}](${currentTrack.raw.url ?? currentTrack.url})**` +
                            `\nRequested by: <@${currentTrack.requestedBy?.id}>` +
                            `\n ${bar}\n\n` +
                            `${
                                queue.repeatMode === 0
                                    ? ''
                                    : `**${
                                        queue.repeatMode === 3
                                            ? this.embedOptions.icons.autoplay
                                            : this.embedOptions.icons.loop
                                    } Looping**\nLoop mode is set to **\`${loopModeUserString}\`**. You can change it with **\`/loop\`**.`
                            }`
                    )
                    .addFields(
                        {
                            name: '**Author**',
                            value: author,
                            inline: true
                        },
                        {
                            name: '**Plays**',
                            value: displayPlays,
                            inline: true
                        },
                        {
                            name: '**Track source**',
                            value: `**${sourceIcons.get(currentTrack.raw.source!)} [${source}](${
                                currentTrack.raw.url ?? currentTrack.url
                            })**`,
                            inline: true
                        }
                    )
                    .setFooter({
                        text: queueLength ? `${queueLength} other tracks in the queue...` : ' '
                    })
                    .setThumbnail(queue.currentTrack!.thumbnail)
                    .setColor(this.embedOptions.colors.info)
            ],
            components: [nowPlayingActionRow as APIActionRowComponent<APIMessageActionRowComponent>]
        });
    }
}

export default new NowPlayingCommand();
