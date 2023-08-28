import { ActivityType, ColorResolvable, PresenceUpdateStatus, ShardingManagerOptions } from 'discord.js';

import { LogLevel } from './serviceTypes';

export interface BotOptions {
    name: string;
    botInviteUrl: string;
    serverInviteUrl: string;
}

export interface ShardingOptions extends ShardingManagerOptions {}

export interface LoggerOptions {
    minimumLogLevel: LogLevel;
    minimumLogLevelConsole: LogLevel;
    discordPlayerDebug: boolean;
}

export interface SystemOptions {
    systemGuildIds: string[];
    systemMessageChannelId: string;
    systemUserId: string;
}

export interface PresenceStatusOptions {
    status: PresenceUpdateStatus;
    activities: {
        name: string;
        type: ActivityType;
    }[];
}

export interface EmbedOptions {
    info: {
        fallbackThumbnailUrl: string;
    };
    colors: {
        success: ColorResolvable;
        warning: ColorResolvable;
        error: ColorResolvable;
        info: ColorResolvable;
        note: ColorResolvable;
    };
    icons: {
        logo: string;
        beta: string;
        new: string;
        rule: string;
        support: string;
        bot: string;
        server: string;
        discord: string;
        audioPlaying: string;
        audioStartedPlaying: string;
        success: string;
        error: string;
        warning: string;
        disable: string;
        enable: string;
        disabled: string;
        enabled: string;
        nextTrack: string;
        previousTrack: string;
        pauseResumeTrack: string;
        shuffleQueue: string;
        loop: string;
        loopAction: string;
        autoplay: string;
        autoplayAction: string;
        looping: string;
        autoplaying: string;
        skipped: string;
        back: string;
        pauseResumed: string;
        shuffled: string;
        volume: string;
        volumeIsMuted: string;
        volumeChanged: string;
        volumeMuted: string;
        queue: string;
        sourceArbitrary: string;
        sourceAppleMusic: string;
        sourceYouTube: string;
        sourceSoundCloud: string;
        sourceSpotify: string;
        liveTrack: string;
    };
}

export interface PlayerOptions {
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
}

export interface FFmpegFilterOption {
    label: string;
    value: string;
    description: string;
    emoji: string;
}

export interface FFmpegFilterOptions {
    threadAmount: string;
    availableFilters: FFmpegFilterOption[];
}

export interface LoadTestOptions {
    enabled: boolean;
    trackUrl: string;
    channelIdsToJoin: string[];
}
