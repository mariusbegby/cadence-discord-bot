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
import { BaseSlashCommandInteraction } from '../../common/classes/interactions';
import { BaseSlashCommandParams, BaseSlashCommandReturnType, TrackMetadata } from '../../types/interactionTypes';
import { checkQueueCurrentTrack, checkQueueExists } from '../../common/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../common/validation/voiceChannelValidator';
import { localizeCommand, useServerTranslator, Translator } from '../../common/utils/localeUtil';
import { formatRepeatModeDetailed } from '../../common/utils/formattingUtils';

class NowPlayingCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = localizeCommand(new SlashCommandBuilder().setName('nowplaying'));
        super(data);
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, interaction } = params;
        const logger = this.getLogger(this.name, executionId, interaction);
        const translator = useServerTranslator(interaction);

        const queue: GuildQueue = useQueue(interaction.guild!.id)!;

        await this.runValidators({ interaction, queue, executionId }, [
            checkInVoiceChannel,
            checkSameVoiceChannel,
            checkQueueExists,
            checkQueueCurrentTrack
        ]);

        const tracksInQueueCount: number = queue.tracks.data.length;
        const currentTrack: Track = queue.currentTrack!;
        const displayTrackUrl: string = this.getFormattedTrackUrl(currentTrack, translator);
        const displayTrackRequestedBy: string = this.getDisplayTrackRequestedBy(currentTrack, translator);
        const displayTrackPlayingStatus: string = this.getDisplayTrackPlayingStatus(queue, translator);
        const displayQueueRepeatMode: string = formatRepeatModeDetailed(
            queue.repeatMode,
            this.embedOptions,
            translator
        );
        const displayEmbedProgressBar: string = this.getDisplayQueueProgressBar(queue, translator);

        const components: APIMessageActionRowComponent[] = [];

        const previousButton: APIButtonComponent = new ButtonBuilder()
            .setDisabled(queue.history.tracks.data.length > 0 ? false : true)
            .setCustomId(`action-previous-button_${currentTrack.id}`)
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(this.embedOptions.icons.previousTrack)
            .toJSON();
        components.push(previousButton);

        const playPauseButton: APIButtonComponent = new ButtonBuilder()
            .setCustomId(`action-pauseresume-button_${currentTrack.id}`)
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(this.embedOptions.icons.pauseResumeTrack)
            .toJSON();
        components.push(playPauseButton);

        const skipButton: APIButtonComponent = new ButtonBuilder()
            .setCustomId(`action-skip-button_${currentTrack.id}`)
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(this.embedOptions.icons.nextTrack)
            .toJSON();
        components.push(skipButton);

        if (this.embedOptions.components.showButtonLabels) {
            previousButton.label = translator('musicPlayerCommon.controls.previous');
            playPauseButton.label = queue.node.isPaused()
                ? translator('musicPlayerCommon.controls.resume')
                : translator('musicPlayerCommon.controls.pause');
            skipButton.label = translator('musicPlayerCommon.controls.skip');
        }

        const embedActionRow: APIActionRowComponent<APIMessageActionRowComponent> = {
            type: ComponentType.ActionRow,
            components
        };

        logger.debug('Sending info embed with action row components.');
        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(this.getEmbedQueueAuthor(interaction, queue, translator))
                    .setDescription(
                        `${displayTrackPlayingStatus}\n` +
                            `${displayTrackUrl}\n` +
                            `${translator('musicPlayerCommon.requestedBy', {
                                user: displayTrackRequestedBy
                            })}\n` +
                            `${displayEmbedProgressBar}\n` +
                            `${displayQueueRepeatMode}\n\n`
                    )
                    .addFields(this.getEmbedFields(currentTrack, translator))
                    .setFooter({
                        text: tracksInQueueCount
                            ? translator('commands.nowplaying.otherTracksInQueue', { count: tracksInQueueCount })
                            : ' '
                    })
                    .setThumbnail(this.getTrackThumbnailUrl(queue.currentTrack!))
                    .setColor(this.embedOptions.colors.info)
            ],
            components: [embedActionRow]
        });
    }

    private getDisplayPlays(currentTrack: Track | undefined, translator: Translator): string {
        const trackMetadata = currentTrack?.metadata as TrackMetadata;

        return translator('commands.nowplaying.playCount', {
            count: currentTrack?.views || trackMetadata?.bridge?.views || 0
        });
    }

    private getDisplayTrackAuthor(currentTrack: Track | undefined, translator: Translator): string {
        let author = currentTrack?.author;
        if (!author || author === 'cdn.discordapp.com') {
            author = translator('musicPlayerCommon.unavailableAuthor');
        }
        return author;
    }

    private getTrackSourceString(currentTrack: Track, translator: Translator): string {
        const sourceStringsFormatted: Map<string, string> = new Map([
            ['youtube', 'YouTube'],
            ['soundcloud', 'SoundCloud'],
            ['spotify', 'Spotify'],
            ['apple_music', 'Apple Music'],
            ['arbitrary', translator('commands.pause.directSource')]
        ]);

        return (
            sourceStringsFormatted.get(currentTrack.raw.source!) ?? translator('musicPlayerCommon.unavailableSource')
        );
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

    private getDisplayTrackSource(currentTrack: Track, translator: Translator) {
        const trackSource: string = this.getTrackSourceString(currentTrack, translator);
        const trackSourceIcon: string = this.getTrackSourceIcon(currentTrack) ?? '';

        return `**${trackSourceIcon} [${trackSource}](${currentTrack.raw.url ?? currentTrack.url})**`;
    }

    private getDisplayTrackPlayingStatus = (queue: GuildQueue, translator: Translator): string => {
        return queue.node.isPaused()
            ? translator('musicPlayerCommon.nowPausedTitle', { icon: this.embedOptions.icons.paused })
            : translator('musicPlayerCommon.nowPlayingTitle', { icon: this.embedOptions.icons.audioPlaying });
    };

    private getEmbedFields = (currentTrack: Track, translator: Translator): EmbedField[] => {
        const fields: EmbedField[] = [
            {
                name: translator('commands.nowplaying.embedFields.author'),
                value: this.getDisplayTrackAuthor(currentTrack, translator),
                inline: true
            },
            {
                name: translator('commands.nowplaying.embedFields.plays'),
                value: this.getDisplayPlays(currentTrack, translator),
                inline: true
            },
            {
                name: translator('commands.nowplaying.embedFields.source'),
                value: this.getDisplayTrackSource(currentTrack, translator),
                inline: true
            }
        ];

        return fields;
    };
}

export default new NowPlayingCommand();
