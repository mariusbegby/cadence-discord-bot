import { ActivityType, ColorResolvable, PresenceUpdateStatus } from 'discord.js';
import { LogLevel } from './serviceTypes';

export type CustomLoggerOptions = {
    minimumLogLevel: LogLevel;
    minimumLogLevelConsole: LogLevel;
    discordPlayerDebug: boolean;
};

export type SystemOptions = {
    systemGuildIds: string[];
    systemMessageChannelId: string;
    systemUserId: string;
};

export type PresenceStatusOptions = {
    status: PresenceUpdateStatus;
    activities: {
        name: string;
        type: ActivityType;
    }[];
};

export type EmbedOptions = {
    info: {
        fallbackThumbnailUrl: string;
        fallbackIconUrl: string;
    };
    colors: {
        success: ColorResolvable;
        warning: ColorResolvable;
        error: ColorResolvable;
        info: ColorResolvable;
        note: ColorResolvable;
    };
    icons: {
        autoplay: string;
        liveTrack: string;
        queue: string;
        shuffled: string;
        skipped: string;
        sourceArbitrary: string;
        sourceAppleMusic: string;
        sourceYouTube: string;
        sourceSoundCloud: string;
        sourceSpotify: string;
        volume: string;
        volumeChanged: string;
        volumeIsMuted: string;
        volumeMuted: string;
        resolved: string;
        investigating: string;
        outage: string;
        repeat: string;
        nyctophileZuiDart: string;
        nyctophileZuiDisable: string;
        nyctophileZuiGlobe: string;
        nyctophileZuiHeadphones: string;
        nyctophileZuiLeave: string;
        nyctophileZuiMegaphone: string;
        nyctophileZuiModified: string;
        nyctophileZuiModify: string;
        nyctophileZuiPause: string;
        nyctophileZuiPlay: string;
        nyctophileZuiRepeat: string;
        nyctophileZuiRobot: string;
        nyctophileZuiServer: string;
        nyctophileZuiStop: string;
        nyctophileZuiSuccess: string;
        nyctophileZuiThumbsDown: string;
        nyctophileZuiThumbsUp: string;
        nyctophileZuiTrash: string;
        nyctophileZuiQueue: string;
        nyctophileZuiWarning: string;
    };
};

export type PlayerOptions = {
    leaveOnEmpty: boolean;
    leaveOnEmptyCooldown: number;
    leaveOnEnd: boolean;
    leaveOnEndCooldown: number;
    leaveOnStop: boolean;
    leaveOnStopCooldown: number;
    defaultVolume: number;
    maxQueueSize: number;
    maxHistorySize: number;
    bufferingTimeout: number;
    connectionTimeout: number;
    progressBar: {
        length: number;
        timecodes: boolean;
        separator: string;
        indicator: string;
        leftChar: string;
        rightChar: string;
    };
};

export type FFmpegFilterOption = {
    label: string;
    value: string;
    emoji: string;
};

export type FFmpegFilterOptions = {
    threadAmount: string;
    forceNormalizerByBassBoost: boolean;
    availableFilters: FFmpegFilterOption[];
};

export type LoadTestOptions = {
    enabled: boolean;
    trackUrl: string;
    channelIdsToJoin: string[];
};
