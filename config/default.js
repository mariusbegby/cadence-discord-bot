// Import Discord.js types for TypeScript support.
const { ActivityType, PresenceUpdateStatus } = require('discord.js');

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
    systemGuildIds: ['968117722544238592', '1095033605769658565'],
    // Channel for sending system messages, such as bot errors and disconnect events. e.g. '123456789012345678'
    // Selene
    systemMessageChannelId: '1152593650560274454',
    // Nyctophile
    // systemMessageChannelId: '',
    // Bot administrator user ID for specific notifications through mentions in system channel. e.g. '123456789012345678'
    systemUserId: '981619626138017883'
};

// Configuration for the bot's presence and activity status.
// Incude const { ActivityType, PresenceUpdateStatus } = require('discord.js'); at the top of config file.
module.exports.presenceStatusOptions = {
    status: PresenceUpdateStatus.DoNotDisturb,
    activities: [
        {
            name: 'Cindy\'s 💗',
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
        autoplay: '♾️',
        liveTrack: '<:nyctophileLiveTrack:1152604122621685880>',
        queue: '🎶',
        shuffled: '🔀',
        skipped: '⏭️',
        sourceArbitrary: '🎵',
        sourceAppleMusic: '🎵',
        sourceYouTube: '<:nyctophileYouTube:1152788207969247242>',
        sourceSoundCloud: '<:nyctophileSoundcloud:1152788189505925171>',
        sourceSpotify: '<:nyctophileSpotify:1152788199584825436>',
        volume: '🔊',
        volumeChanged: '🔊',
        volumeIsMuted: '🔇',
        volumeMuted: '🔇',
        resolved: '<:nyctophileResolved:1152212451375468637>',
        investigating: '<:nyctophileInvestigating:1152212441439158324>',
        outage: '<:nyctophileOutage:1152212446543630408>',
        repeat: '<:nyctophileRepeat:1152601108741640273>',
        nyctophileZuiDart: '<:nyctophileZuiDart:1152957723609145445>',
        nyctophileZuiDisable: '<:nyctophileZuiDisable:1152952370347638845>',
        nyctophileZuiGlobe: '<:nyctophileZuiGlobe:1152952376794300536>',
        nyctophileZuiHeadphones: '<:nyctophileZuiHeadphones:1152955621587554355>',
        nyctophileZuiLeave: '<:nyctophileZuiLeave:1152952383115100160>',
        nyctophileZuiMegaphone: '<:nyctophileZuiMegaphone:1152952387686899885>',
        nyctophileZuiModified: '<:nyctophileZuiModified:1152952405248450562>',
        nyctophileZuiModify: '<:nyctophileZuiModify:1152954893951320215>',
        nyctophileZuiPause: '<:nyctophileZuiPause:1152790550324453457>',
        nyctophileZuiPlay: '<:nyctophileZuiPlay:1152952418523414689>',
        nyctophileZuiRepeat: '<:nyctophileZuiRepeat:1152975657903607809>',
        nyctophileZuiRobot: '<:nyctophileZuiRobot:1152975587615457337>',
        nyctophileZuiServer: '<:nyctophileZuiServer:1152989220571467977>',
        nyctophileZuiStop: '<:nyctophileZuiStop:1152790580192096368>',
        nyctophileZuiSuccess: '<:nyctophileZuiSuccess:1152952433492893727>',
        nyctophileZuiThumbsDown: '<:nyctophileZuiThumbsDown:1152952439494942742>',
        nyctophileZuiThumbsUp: '<:nyctophileZuiThumbsUp:1152952447950651503>',
        nyctophileZuiTrash: '<:nyctophileZuiTrash:1152808983476846592>',
        nyctophileZuiQueue: '<:nyctophileZuiQueue:1152952426643587134>',
        nyctophileZuiWarning: '<:nyctophileZuiWarning:1152952454795759719>'
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
    maxHistorySize: 1_000,
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
            label: 'Bass Boost',
            value: 'bassboost_low',
            emoji: '🔉'
        },
        {
            label: 'Bass Boost High',
            value: 'bassboost',
            emoji: '🔊'
        },
        {
            label: 'Night Core',
            value: 'nightcore',
            emoji: '🐱'
        },
        {
            label: 'Lo-fi',
            value: 'lofi',
            emoji: '📻'
        },
        {
            label: 'Vaporwave',
            value: 'vaporwave',
            emoji: '🌸'
        },
        {
            label: 'Ear Rape',
            value: 'earrape',
            emoji: '👂'
        },
        {
            label: '8D',
            value: '8D',
            emoji: '🎧'
        },
        {
            label: 'Treble',
            value: 'treble',
            emoji: '🎼'
        },
        {
            label: 'Normalizer',
            value: 'normalizer',
            emoji: '🎶'
        },
        {
            label: 'Remove Silince',
            value: 'silenceremove',
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
