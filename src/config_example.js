const { ActivityType, PresenceUpdateStatus } = require('discord.js');
// Description: Config file for Cadence Discord bot.

// General options for information about the bot.
module.exports.botOptions = {
    name: 'Cadence',
    websiteUrl: 'Unknown',
    botInviteUrl: 'Unknown',
    serverInviteUrl: 'Unknown'
};

// Logging options for the bot, can set logging level to file and console separately.
module.exports.loggerOptions = {
    minimumLogLevel: 'debug',
    minimumLogLevelConsole: 'info'
};

// systemGuildIds: Array of guild ids where system commands should be available.
// systemMessageChannelId: Channel id where system messages should be sent, such as error events.
// systemUserId: User id of the system administrator, used for pining on certain system messages.
module.exports.systemOptions = {
    systemGuildIds: ['Guild id where system commands can be used'],
    systemMessageChannelId: 'Channel id where system messages will be sent',
    systemUserId: 'User id of the system administrator which will receive pings on certain system messages'
};

// Options for presence/activity status. You can change from watching to listening, playing, etc.
// See https://discord-api-types.dev/api/discord-api-types-v10/enum/ActivityType for valid activity types.
// See https://discord-api-types.dev/api/discord-api-types-v10/enum/PresenceUpdateStatus for valid presence status.
module.exports.presenceStatusOptions = {
    status: PresenceUpdateStatus.Online,
    activities: [
        {
            name: '/help 🎶',
            type: ActivityType.Listening
        }
    ]
};

// Options for embed messages, like colors and custom emojis.
module.exports.embedOptions = {
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
        sourceSpotify: '🎵'
    }
};

// Options for the discord-player player.
module.exports.playerOptions = {
    leaveOnEmpty: true,
    leaveOnEmptyCooldown: 300000,
    leaveOnEnd: true,
    leaveOnEndCooldown: 300000,
    leaveOnStop: true,
    leaveOnStopCooldown: 300000,
    defaultVolume: 50,
    maxQueueSize: 1000,
    maxHistorySize: 100,
    progressBar: {
        length: 14,
        timecodes: false,
        separator: '┃',
        indicator: '🔘',
        leftChar: '▬',
        rightChar: '▬'
    }
};

// Options to be used by the ffmpeg, and available ffmpeg filters shown in filter commands.
module.exports.ffmpegFilterOptions = {
    threadAmount: '2',
    filterList: [
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
        }
    ]
};
