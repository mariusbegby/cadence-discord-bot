import { GuildQueue, Track, useQueue } from 'discord-player';
import {
    APIActionRowComponent,
    APIButtonComponent,
    APIMessageActionRowComponent,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    EmbedBuilder,
    EmbedField,
    SlashCommandBuilder
} from 'discord.js';
import { BaseSlashCommandInteraction } from '../../../classes/interactions';
import { BaseSlashCommandParams, BaseSlashCommandReturnType, TrackMetadata } from '../../../types/interactionTypes';
import { checkQueueCurrentTrack, checkQueueExists } from '../../../utils/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../../utils/validation/voiceChannelValidator';

class NowPlayingCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = new SlashCommandBuilder()
            .setName('nowplaying')
            .setDescription('Menampilkan informasi tentang lagu (tracks) saat ini');
        super(data);
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, interaction } = params;
        const logger = this.getLogger(this.name, executionId, interaction);
        const queue: GuildQueue = useQueue(interaction.guild!.id)!;

        await this.runValidators({ interaction, queue, executionId }, [
            checkInVoiceChannel,
            checkSameVoiceChannel,
            checkQueueExists,
            checkQueueCurrentTrack
        ]);

        const tracksInQueueCount: number = queue.tracks.data.length;
        const currentTrack: Track = queue.currentTrack!;
        const displayTrackRequestedBy: string = this.getDisplayTrackRequestedBy(currentTrack);
        const displayQueueRepeatMode: string = this.getDisplayQueueRepeatMode(queue);
        const displayEmbedProgressBar: string = this.getDisplayQueueProgressBar(queue);
        const customId: string = `nowplaying-skip-button_${currentTrack.id}`;

        logger.debug(`Generated custom id for skip button: ${customId}`);

        const skipButton: APIButtonComponent = new ButtonBuilder()
            .setCustomId(customId)
            .setLabel('Lewati lagu (tracks)')
            .setStyle(ButtonStyle.Primary)
            .toJSON();
        const embedActionRow: APIActionRowComponent<APIMessageActionRowComponent> = {
            type: ComponentType.ActionRow,
            components: [skipButton]
        };

        logger.debug('Sending info embed with action row components.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${currentTrack.title}`)
                    .setDescription(`${displayEmbedProgressBar}\n\n ` + `${displayQueueRepeatMode}\n\n`)
                    .addFields(this.getEmbedFields(currentTrack))
                    .setFooter({
                        text: tracksInQueueCount
                            ? `${tracksInQueueCount} lagu (tracks) lainnya dalam antrian...`
                            : `${displayTrackRequestedBy} memainkan lagu ini`,
                        iconURL: tracksInQueueCount ? '' : interaction.user.displayAvatarURL()
                    })
                    .setThumbnail(this.getTrackThumbnailUrl(queue.currentTrack!))
                    .setColor(this.embedOptions.colors.info)
            ],
            components: [embedActionRow as APIActionRowComponent<APIMessageActionRowComponent>]
        });
    }

    private getDisplayPlays(currentTrack: Track | undefined): string {
        const trackMetadata = currentTrack?.metadata as TrackMetadata;
        let displayPlays: string =
            (currentTrack?.views || trackMetadata?.bridge?.views || 0).toLocaleString('id-ID') ?? '0';

        if (displayPlays === '0') {
            displayPlays = 'Ngga tersedia';
        }

        return displayPlays;
    }

    private getDisplayTrackAuthor(currentTrack: Track | undefined): string {
        let author: string = currentTrack?.author ? currentTrack.author : 'Ngga tersedia';

        if (author === 'cdn.discordapp.com') {
            author = 'Ngga tersedia';
        }

        return author;
    }

    private getTrackSourceString(currentTrack: Track): string {
        const sourceStringsFormatted: Map<string, string> = new Map([
            ['youtube', 'YouTube'],
            ['soundcloud', 'SoundCloud'],
            ['spotify', 'Spotify'],
            ['apple_music', 'Apple Music'],
            ['arbitrary', 'Direct source']
        ]);

        return sourceStringsFormatted.get(currentTrack.raw.source!) ?? 'Ngga tersedia';
    }

    private getTrackSourceIcon(currentTrack: Track): string {
        const sourceIcons: Map<string, string> = new Map([
            ['youtube', this.embedOptions.icons.sourceYouTube],
            ['soundcloud', this.embedOptions.icons.sourceSoundCloud],
            ['spotify', this.embedOptions.icons.sourceSpotify],
            ['apple_music', this.embedOptions.icons.sourceAppleMusic],
            ['arbitrary', this.embedOptions.icons.sourceArbitrary]
        ]);

        return sourceIcons.get(currentTrack.raw.source!) ?? '';
    }

    private getDisplayTrackSource(currentTrack: Track) {
        const trackSource: string = this.getTrackSourceString(currentTrack) ?? 'Ngga tersedia';
        const trackSourceIcon: string = this.getTrackSourceIcon(currentTrack) ?? '';

        return `**${trackSourceIcon} [${trackSource}](${currentTrack.raw.url ?? currentTrack.url})**`;
    }

    private getRepeatModeString(repeatMode: number): string {
        const loopModesFormatted: Map<number, string> = new Map([
            [0, 'disabled'],
            [1, 'track'],
            [2, 'queue'],
            [3, 'autoplay']
        ]);

        return loopModesFormatted.get(repeatMode)!;
    }

    private getDisplayQueueRepeatMode = (queue: GuildQueue): string => {
        const repeatMode: number = queue.repeatMode;

        if (repeatMode === 0) {
            return '';
        }

        const loopModeUserString: string = this.getRepeatModeString(repeatMode);
        const icon = repeatMode === 3 ? this.embedOptions.icons.autoplay : this.embedOptions.icons.nyctophileZuiRepeat;

        return `**${icon} | Sedang** menggunakan mode pengulangan **\`${loopModeUserString}\`**.`;
    };

    private getEmbedFields = (currentTrack: Track): EmbedField[] => {
        const fields: EmbedField[] = [
            {
                name: '**Author**',
                value: this.getDisplayTrackAuthor(currentTrack),
                inline: true
            },
            {
                name: '**Dimainkan**',
                value: this.getDisplayPlays(currentTrack),
                inline: true
            },
            {
                name: '**Sumber**',
                value: this.getDisplayTrackSource(currentTrack),
                inline: true
            }
        ];

        return fields;
    };
}

export default new NowPlayingCommand();
