import config from 'config';
import { GuildQueue, PlayerTimestamp, Track } from 'discord-player';
import {
    ApplicationCommandOptionChoiceData,
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    EmbedAuthorOptions,
    EmbedFooterData,
    GuildMember,
    Interaction,
    Message,
    MessageComponentInteraction,
    SlashCommandBuilder,
    SlashCommandSubcommandsOnlyBuilder
} from 'discord.js';
import { Logger } from 'pino';
import loggerModule from '../services/logger';
import { EmbedOptions, PlayerOptions } from '../types/configTypes';
import {
    BaseAutocompleteParams,
    BaseAutocompleteReturnType,
    BaseComponentParams,
    BaseComponentReturnType,
    BaseInteractionParams,
    BaseSlashCommandParams,
    BaseSlashCommandReturnType
} from '../types/interactionTypes';
import { Validator, ValidatorParams } from '../types/utilTypes';

abstract class BaseInteraction {
    embedOptions: EmbedOptions;
    playerOptions: PlayerOptions;

    constructor() {
        this.embedOptions = config.get('embedOptions');
        this.playerOptions = config.get('playerOptions');
    }

    protected getLoggerBase(
        module: string,
        name: string,
        executionId: string,
        interaction: Interaction | MessageComponentInteraction
    ): Logger {
        return loggerModule.child({
            module: module,
            name: name,
            executionId: executionId,
            shardId: interaction.guild?.shardId,
            guildId: interaction.guild?.id
        });
    }

    protected validators: Validator[] = [];

    protected async runValidators(args: ValidatorParams, validators?: Validator[]): Promise<void> {
        for (const validator of validators ? validators : this.validators) {
            await validator(args);
        }
    }

    protected getFormattedDuration(track: Track): string {
        let durationFormat =
            Number(track.raw.duration) === 0 || track.duration === '0:00' ? '' : `**\`${track.duration}\`**`;

        if (track.raw.live) {
            durationFormat = `**${this.embedOptions.icons.liveTrack} \`LIVE\`**`;
        }

        return durationFormat;
    }

    protected getFormattedTrackUrl(track: Track): string {
        const trackTitle = track.title ?? 'Judul ngga tersedia';
        const trackAuthor = track.author ?? 'Author ngga tersedia';
        const trackUrl = track.url ?? track.raw.url;
        if (!trackTitle || !trackUrl || !trackAuthor) {
            return 'Ngga tersedia';
        }
        return `**[${trackTitle} - ${trackAuthor}](${trackUrl})**`;
    }

    protected getDisplayTrackDurationAndUrl(track: Track): string {
        const formattedDuration = this.getFormattedDuration(track);
        const formattedUrl = this.getFormattedTrackUrl(track);

        return `${formattedDuration} ${formattedUrl}`;
    }

    protected getTrackThumbnailUrl(track: Track): string {
        let thumbnailUrl = '';

        if (track.source === 'youtube') {
            if (track.raw.thumbnail) {
                // @ts-ignore -- discord-player bug with thumbnail for youtube?
                thumbnailUrl = track.raw.thumbnail.url;
            } else if (track.thumbnail && !track.thumbnail.endsWith('maxresdefault.jpg')) {
                // @ts-ignore -- discord-player bug with thumbnail for youtube?
                thumbnailUrl = track.thumbnail.url;
            } else {
                thumbnailUrl = this.embedOptions.info.fallbackThumbnailUrl;
            }
        } else {
            if (track.raw.thumbnail) {
                thumbnailUrl = track.raw.thumbnail;
            } else if (track.thumbnail) {
                thumbnailUrl = track.thumbnail;
            } else {
                thumbnailUrl = this.embedOptions.info.fallbackThumbnailUrl;
            }
        }

        return thumbnailUrl;
    }

    protected getFooterDisplayPageInfo(interaction: ChatInputCommandInteraction, queue: GuildQueue): EmbedFooterData {
        if (!queue.tracks.data.length) {
            return { text: 'Halaman 1 dari 1 (0 lagu (tracks))' };
        }

        const pageIndex: number = (interaction.options.getNumber('page') || 1) - 1;
        const totalPages: number = Math.ceil(queue.tracks.data.length / 10) || 1;
        return {
            text: `Halaman ${pageIndex + 1} dari ${totalPages} (${queue.tracks.data.length} lagu (tracks))`
        };
    }

    protected getDisplayTrackRequestedBy = (track: Track): string => {
        return track.requestedBy ? `${track.requestedBy.username}` : 'Ngga tersedia';
    };

    protected getDisplayQueueProgressBar(queue: GuildQueue): string {
        const timestamp: PlayerTimestamp = queue.node.getTimestamp()!;
        let progressBar: string = `**\`${timestamp.current.label}\`** ${queue.node.createProgressBar({
            queue: false,
            length: this.playerOptions.progressBar.length ?? 12,
            timecodes: this.playerOptions.progressBar.timecodes ?? false,
            indicator: this.playerOptions.progressBar.indicator ?? '🔘',
            leftChar: this.playerOptions.progressBar.leftChar ?? '▬',
            rightChar: this.playerOptions.progressBar.rightChar ?? '▬'
        })} **\`${timestamp.total.label}\`**`;

        if (Number(queue.currentTrack?.raw.duration) === 0 || queue.currentTrack?.duration === '0:00') {
            progressBar = '_Tidak ada durasi yang tersedia._';
        }

        if (queue.currentTrack?.raw.live) {
            progressBar = `${this.embedOptions.icons.liveTrack} **\`LIVE\`** — Memutar terus menerus dari sumber live.`;
        }

        return progressBar;
    }

    protected getDisplayRepeatMode(repeatMode: number): string {
        let loopModeUserString: string;
        let icon: string;

        switch (repeatMode) {
            case 1:
                loopModeUserString = 'track';
                icon = this.embedOptions.icons.nyctophileZuiRepeat;
                break;
            case 2:
                loopModeUserString = 'queue';
                icon = this.embedOptions.icons.nyctophileZuiRepeat;
                break;
            case 3:
                loopModeUserString = 'autoplay';
                icon = this.embedOptions.icons.autoplay;
                break;
            default:
                return '';
        }

        return `**${icon} | Menggunakan** mode pengulangan **\`${loopModeUserString}\`**.`;
    }

    abstract execute(
        params: BaseInteractionParams
    ): Promise<Message<boolean> | ApplicationCommandOptionChoiceData | void>;
}

abstract class BaseInteractionWithEmbedResponse extends BaseInteraction {
    constructor() {
        super();
    }

    protected getEmbedUserAuthor(
        interaction: MessageComponentInteraction | ChatInputCommandInteraction
    ): EmbedAuthorOptions {
        let authorName: string = '';
        if (interaction.member instanceof GuildMember) {
            authorName = interaction.member.nickname || interaction.user.username;
        } else {
            authorName = interaction.user.username;
        }

        return {
            name: authorName,
            iconURL: interaction.user.avatarURL() || this.embedOptions.info.fallbackIconUrl
        };
    }

    protected getEmbedQueueAuthor(
        interaction: MessageComponentInteraction | ChatInputCommandInteraction,
        queue: GuildQueue
    ): EmbedAuthorOptions {
        const bitrate = queue.channel ? queue.channel.bitrate / 1000 : 0;

        return {
            name: `Channel: ${queue.channel!.name} (${bitrate}kbps)`,
            iconURL: interaction.guild!.iconURL() || this.embedOptions.info.fallbackIconUrl
        };
    }
}

export abstract class BaseSlashCommandInteraction extends BaseInteractionWithEmbedResponse {
    data: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'> | SlashCommandSubcommandsOnlyBuilder;
    isSystemCommand: boolean;
    name: string;

    constructor(
        data: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'> | SlashCommandSubcommandsOnlyBuilder,
        isSystemCommand: boolean = false
    ) {
        super();
        this.data = data.setDMPermission(false).setNSFW(false);
        this.isSystemCommand = isSystemCommand;
        this.name = data.name;
    }

    protected getLogger(name: string, executionId: string, interaction: ChatInputCommandInteraction): Logger {
        return super.getLoggerBase('slashCommandInteraction', name, executionId, interaction);
    }

    abstract execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType;
}

export abstract class BaseComponentInteraction extends BaseInteractionWithEmbedResponse {
    name: string;

    constructor(name: string) {
        super();
        this.name = name;
    }

    protected getLogger(name: string, executionId: string, interaction: MessageComponentInteraction): Logger {
        return super.getLoggerBase('componentInteraction', name, executionId, interaction);
    }

    abstract execute(params: BaseComponentParams): BaseComponentReturnType;
}

export abstract class BaseAutocompleteInteraction extends BaseInteraction {
    name: string;

    constructor(name: string) {
        super();
        this.name = name;
    }

    protected getLogger(name: string, executionId: string, interaction: AutocompleteInteraction): Logger {
        return super.getLoggerBase('autocompleteInteraction', name, executionId, interaction);
    }

    abstract execute(params: BaseAutocompleteParams): BaseAutocompleteReturnType;
}

export class CustomError extends Error {
    type?: string;
    code?: string;
}

export class InteractionValidationError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = 'InteractionValidationError';
    }
}
