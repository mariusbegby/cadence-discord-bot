import config from 'config';
import {
    ApplicationCommandOptionChoiceData,
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    EmbedAuthorOptions,
    EmbedFooterData,
    Interaction,
    Message,
    MessageComponentInteraction,
    SlashCommandBuilder,
    SlashCommandSubcommandsOnlyBuilder,
    GuildMember
} from 'discord.js';
import { Track, GuildQueue, GuildQueueHistory, PlayerTimestamp } from 'discord-player';
import { Logger } from 'pino';
import loggerModule from '../services/logger';
import { BotOptions, EmbedOptions, PlayerOptions } from '../types/configTypes';
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
import { TFunction } from 'i18next';

abstract class BaseInteraction {
    embedOptions: EmbedOptions;
    botOptions: BotOptions;
    playerOptions: PlayerOptions;
    protected validators: Validator[] = [];

    constructor() {
        this.embedOptions = config.get('embedOptions');
        this.botOptions = config.get('botOptions');
        this.playerOptions = config.get('playerOptions');
    }

    protected getLoggerBase(
        module: string,
        name: string,
        executionId: string,
        interaction: Interaction | MessageComponentInteraction
    ): Logger {
        return loggerModule.child({
            module,
            name,
            executionId,
            shardId: interaction.guild?.shardId,
            guildId: interaction.guild?.id
        });
    }

    protected async runValidators(args: ValidatorParams, validators?: Validator[]): Promise<void> {
        for (const validator of validators ?? this.validators) {
            await validator(args);
        }
    }

    protected getFormattedDuration(track: Track): string {
        const { raw, duration } = track;
        const durationFormat = Number(raw.duration) === 0 || duration === '0:00' ? '' : `**\`${duration}\`**`;

        if (raw.live) {
            return `**${this.embedOptions.icons.liveTrack} \`LIVE\`**`;
        }

        return durationFormat;
    }

    protected getFormattedTrackUrl(track: Track, translator: TFunction): string {
        const { title, url, raw } = track;
        const trackTitle = title ?? translator('musicPlayerCommon.unavailableTrackTitle');
        const trackUrl = url ?? raw.url;

        if (!trackTitle || !trackUrl) {
            return translator('musicPlayerCommon.unavailableTrackUrl');
        }

        return `**[${trackTitle}](${trackUrl})**`;
    }

    protected getDisplayTrackDurationAndUrl(track: Track, translator: TFunction): string {
        const formattedDuration = this.getFormattedDuration(track);
        const formattedUrl = this.getFormattedTrackUrl(track, translator);

        return `${formattedDuration} ${formattedUrl}`;
    }

    protected getTrackThumbnailUrl(track: Track): string {
        const { source, raw, thumbnail } = track;
        let thumbnailUrl = '';

        if (source === 'youtube') {
            if (raw.thumbnail || (thumbnail && !thumbnail.endsWith('maxresdefault.jpg'))) {
                // @ts-ignore
                thumbnailUrl = raw.thumbnail?.url || thumbnail?.url;
            } else {
                thumbnailUrl = this.embedOptions.info.fallbackThumbnailUrl;
            }
        } else {
            thumbnailUrl = raw.thumbnail || thumbnail || this.embedOptions.info.fallbackThumbnailUrl;
        }

        return thumbnailUrl;
    }

    protected getFooterDisplayPageInfo(
        interaction: ChatInputCommandInteraction,
        queue: GuildQueue | GuildQueueHistory,
        translator: TFunction
    ): EmbedFooterData {
        const pageIndex: number = (interaction.options.getInteger('page') || 1) - 1;
        const totalPages: number = Math.ceil(queue.tracks.data.length / 10) || 1;

        return {
            text: translator('musicPlayerCommon.footerPageNumber', {
                page: pageIndex + 1,
                pageCount: totalPages,
                count: queue.tracks.data.length
            })
        };
    }

    protected getDisplayTrackRequestedBy = (track: Track, translator: TFunction): string =>
        track.requestedBy ? `<@${track.requestedBy.id}>` : translator('musicPlayerCommon.unavailableRequestedBy');

    protected getDisplayQueueProgressBar(queue: GuildQueue, translator: TFunction): string {
        const timestamp: PlayerTimestamp = queue.node.getTimestamp()!;
        const progressBar = `**\`${timestamp.current.label}\`** ${queue.node.createProgressBar({
            queue: false,
            length: this.playerOptions.progressBar.length ?? 12,
            timecodes: this.playerOptions.progressBar.timecodes ?? false,
            indicator: this.playerOptions.progressBar.indicator ?? '🔘',
            leftChar: this.playerOptions.progressBar.leftChar ?? '▬',
            rightChar: this.playerOptions.progressBar.rightChar ?? '▬'
        })} **\`${timestamp.total.label}\`**`;

        if (Number(queue.currentTrack?.raw.duration) === 0 || queue.currentTrack?.duration === '0:00') {
            return translator('musicPlayerCommon.unavailableDuration');
        }

        if (queue.currentTrack?.raw.live) {
            return translator('musicPlayerCommon.playingLive', {
                icon: this.embedOptions.icons.liveTrack
            });
        }

        return progressBar;
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
        const authorName =
            interaction.member instanceof GuildMember
                ? interaction.member.nickname || interaction.user.username
                : interaction.user.username;

        return {
            name: authorName,
            iconURL: interaction.user.avatarURL() || this.embedOptions.info.fallbackIconUrl
        };
    }

    protected getEmbedQueueAuthor(
        interaction: MessageComponentInteraction | ChatInputCommandInteraction,
        queue: GuildQueue,
        translator: TFunction
    ): EmbedAuthorOptions {
        const bitrate = queue.channel ? queue.channel.bitrate / 1000 : 0;

        return {
            name: translator('musicPlayerCommon.voiceChannelInfo', {
                channel: queue.channel!.name,
                bitrate
            }),
            iconURL: interaction.guild!.iconURL() || this.embedOptions.info.fallbackIconUrl
        };
    }
}

export abstract class BaseSlashCommandInteraction extends BaseInteractionWithEmbedResponse {
    data: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'> | SlashCommandSubcommandsOnlyBuilder;
    isSystemCommand: boolean;
    isNew: boolean;
    isBeta: boolean;
    name: string;

    constructor(
        data: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'> | SlashCommandSubcommandsOnlyBuilder,
        isSystemCommand = false,
        isNew = false,
        isBeta = false
    ) {
        super();
        this.data = data.setDMPermission(false).setNSFW(false);
        this.isSystemCommand = isSystemCommand;
        this.isNew = isNew;
        this.isBeta = isBeta;
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
