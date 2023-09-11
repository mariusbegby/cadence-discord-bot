// Import Discord.js types for TypeScript support.
const { ActivityType, PresenceUpdateStatus } = require('discord.js');

// Description: Config file for Cadence Discord bot.

// General metadata about the bot displayed in certain embeds.
module.exports.botOptions = {
    name: 'Cadence',
    botInviteUrl: '',
    serverInviteUrl: ''
};

// Configuration for bot sharding. Refers to splitting a Discord bot into multiple processes.
// For more information, refer to Discord.js sharding documentation: https://discordjs.guide/sharding/
module.exports.shardingOptions = {
    totalShards: 'auto',
    shardList: 'auto',
    mode: 'process',
    respawn: true
};

// Configuration for logging bot actions.
// You can set logging level to file and console separately.
module.exports.loggerOptions = {
    minimumLogLevel: 'debug',
    minimumLogLevelConsole: 'info',
    discordPlayerDebug: false
};

// Options for identifying specific system command.
module.exports.systemOptions = {
    // List of guild IDs where system commands can be executed. e.g. ['123456789012345678', '123456789012345678']
    systemGuildIds: [],
    // Channel for sending system messages, such as bot errors and disconnect events. e.g. '123456789012345678'
    systemMessageChannelId: '',
    // Bot administrator user ID for specific notifications through mentions in system channel. e.g. '123456789012345678'
    systemUserId: ''
};

// Configuration for the bot's presence and activity status.
// Incude const { ActivityType, PresenceUpdateStatus } = require('discord.js'); at the top of config file.
module.exports.presenceStatusOptions = {
    status: PresenceUpdateStatus.Online,
    activities: [
        {
            name: '/help 🎶',
            type: ActivityType.Listening
        }
    ]
};

// Configurations for visual embed messages.
// Includes design elements like colors and custom emojis/symbols.
module.exports.embedOptions = {
    info: {
        fallbackThumbnailUrl:
            'https://raw.githubusercontent.com/mariusbegby/cadence-discord-bot/main/assets/logo-rounded-128px.png',
        fallbackIconUrl:
            'https://raw.githubusercontent.com/mariusbegby/cadence-discord-bot/main/assets/discord-profile-icon.png'
    },
    colors: {
        success: '#23A55A',
        warning: '#F0B232',
        error: '#F23F43',
        info: '#5865F2',
        note: '#80848E'
    },
    icons: {
        logo: '🤖',
        beta: '`beta`',
        new: '`new`',
        rule: '📒',
        support: '❓',
        bot: '🤖',
        server: '🖥️',
        discord: '🌐',
        audioPlaying: '🎶',
        audioStartedPlaying: '🎶',
        success: '✅',
        error: '⚠️',
        warning: '⚠️',
        disable: '🚫',
        enable: '✅',
        disabled: '✅',
        enabled: '✅',
        nextTrack: '⏭️',
        previousTrack: '⏮️',
        pauseResumeTrack: '⏯️',
        shuffleQueue: '🔀',
        loop: '🔁',
        loopAction: '🔁',
        autoplay: '♾️',
        autoplayAction: '♾️',
        looping: '🔁',
        autoplaying: '♾️',
        skipped: '⏭️',
        back: '⏮️',
        pauseResumed: '⏯️',
        shuffled: '🔀',
        volume: '🔊',
        volumeIsMuted: '🔇',
        volumeChanged: '🔊',
        volumeMuted: '🔇',
        queue: '🎶',
        sourceArbitrary: '🎵',
        sourceAppleMusic: '🎵',
        sourceYouTube: '🎵',
        sourceSoundCloud: '🎵',
        sourceSpotify: '🎵',
        liveTrack: '🔴'
    }
};

// Configuration for the audio player. Includes behavior upon various events and UI components.
module.exports.playerOptions = {
    leaveOnEmpty: true,
    leaveOnEmptyCooldown: 1_800_000,
    leaveOnEnd: true,
    leaveOnEndCooldown: 1_800_000,
    leaveOnStop: true,
    leaveOnStopCooldown: 1_800_000,
    defaultVolume: 50,
    maxQueueSize: 10_000,
    maxHistorySize: 100,
    bufferingTimeout: 3_000,
    connectionTimeout: 20_000,
    progressBar: {
        length: 14,
        timecodes: false,
        separator: '┃',
        indicator: '🔘',
        leftChar: '▬',
        rightChar: '▬'
    }
};

// Configuration for ip rotation. Used for avoiding rate limits on certain APIs.
module.exports.ipRotationConfig = {
    blocks: [],
    exclude: [],
    maxRetries: 3
};

// Configuration for ffmpeg filters for audio processing.
module.exports.ffmpegFilterOptions = {
    threadAmount: '2',
    forceNormalizerByBassBoost: true,
    availableFilters: [
        {
            label: 'Bass boost',
            value: 'bassboost_low',
            description: 'Boost the bass of the audio.',
            emoji: '🔉'
        },
        {
            label: 'Bass boost high',
            value: 'bassboost',
            description: 'Boost the bass of the audio a lot.',
            emoji: '🔊'
        },
        {
            label: 'Night core',
            value: 'nightcore',
            description: 'Speed up the audio (higher pitch).',
            emoji: '🐱'
        },
        {
            label: 'Lo-fi',
            value: 'lofi',
            description: 'Low fidelity effect (lower quality).',
            emoji: '📻'
        },
        {
            label: 'Vaporwave',
            value: 'vaporwave',
            description: 'Slow down the audio (lower pitch).',
            emoji: '🌸'
        },
        {
            label: 'Ear rape',
            value: 'earrape',
            description: 'Extremely loud and distorted audio.',
            emoji: '👂'
        },
        {
            label: '8D',
            value: '8D',
            description: 'Simulate 8D audio effect (surround).',
            emoji: '🎧'
        },
        {
            label: 'Treble',
            value: 'treble',
            description: 'Increase the high frequencies.',
            emoji: '🎼'
        },
        {
            label: 'Normalizer',
            value: 'normalizer',
            description: 'Normalize the audio (avoid distortion).',
            emoji: '🎶'
        },
        {
            label: 'Remove silence',
            value: 'silenceremove',
            description: 'Remove silence from start of tracks.',
            emoji: '🔇'
        }
    ]
};

// Configuration for load testing. Enables the bot to simulate certain behaviors for testing purposes.
// If enabled, the bot will join the specified channels and play specified track.
module.exports.loadTestOptions = {
    enabled: false,
    trackUrl: 'https://www.youtube.com/watch?v=tTR4D9h3zAE',
    channelIdsToJoin: []
};
