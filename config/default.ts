// Import Discord.js types for TypeScript support.
import { ActivityType, PresenceUpdateStatus } from 'discord.js';

export const botOptions = {
    name: 'Cadence',
    botInviteUrl: '',
    serverInviteUrl: '',
    openSourceUrl: ''
};

export const shardingOptions = {
    totalShards: 'auto',
    shardList: 'auto',
    mode: 'worker',
    respawn: true
};

export const loggerOptions = {
    minimumLogLevel: 'info',
    minimumLogLevelConsole: 'info',
    discordPlayerDebug: false
};

export const systemOptions = {
    // Channel for sending system messages, such as bot errors and disconnect events. e.g. '123456789012345678'
    systemMessageChannelId: '',
    // Bot administrator user ID for specific notifications through mentions in system channel. e.g. '123456789012345678'
    systemUserId: ''
};

export const presenceStatusOptions = {
    status: PresenceUpdateStatus.Online,
    activities: [
        {
            name: '/help 🎶',
            type: ActivityType.Listening
        }
    ]
};

export const embedOptions = {
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
    components: {
        showButtonLabels: true
    },
    behavior: {
        enablePlayerStartMessages: false
    },
    icons: {
        logo: '🤖',
        beta: '`beta`',
        new: '`new`',
        rule: '📒',
        support: '❓',
        bot: '🤖',
        openSource: '🔓',
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
        paused: '⏸',
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
        moved: '🔀',
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

export const playerOptions = {
    leaveOnEmpty: true,
    leaveOnEmptyCooldown: 600_000,
    leaveOnEnd: false,
    leaveOnEndCooldown: 600_000,
    leaveOnStop: false,
    leaveOnStopCooldown: 600_000,
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

export const ipRotationConfig = {
    blocks: [],
    exclude: [],
    maxRetries: 3
};

export const ffmpegFilterOptions = {
    threadAmount: '2',
    forceNormalizerByBassBoost: true,
    maxFilters: 10,
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
        },
        {
            label: 'Fade in',
            value: 'fadein',
            description: 'Fade in the audio at the start of tracks.',
            emoji: '📈'
        }
    ]
};

export const biquadFilterOptions = {
    availableFilters: [
        {
            label: 'Basic low pass (approx.)',
            value: 'SinglePoleLowPassApprox',
            description: 'Low frequencies pass, approximate.',
            emoji: '🔉'
        },
        {
            label: 'Basic low pass',
            value: 'SinglePoleLowPass',
            description: 'Low frequencies pass.',
            emoji: '🔊'
        },
        {
            label: 'Advanced low pass',
            value: 'LowPass',
            description: 'Enhanced low frequency pass.',
            emoji: '🔊'
        },
        {
            label: 'High pass',
            value: 'HighPass',
            description: 'High frequencies pass.',
            emoji: '🔊'
        },
        {
            label: 'Band pass',
            value: 'BandPass',
            description: 'Specific frequency range pass.',
            emoji: '🔊'
        },
        {
            label: 'Notch filter',
            value: 'Notch',
            description: 'Reduces specific frequency.',
            emoji: '🔊'
        },
        {
            label: 'Phase adjuster',
            value: 'AllPass',
            description: 'Alters sound phase.',
            emoji: '🔊'
        },
        {
            label: 'Low shelf',
            value: 'LowShelf',
            description: 'Boosts/reduces low frequencies.',
            emoji: '🔊'
        },
        {
            label: 'High shelf',
            value: 'HighShelf',
            description: 'Boosts/reduces high frequencies.',
            emoji: '🔊'
        },
        {
            label: 'Peaking equalizer',
            value: 'PeakingEQ',
            description: 'Adjusts specific frequencies.',
            emoji: '🔊'
        }
    ]
};

export const equalizerFilterOptions = {
    availableFilters: [
        {
            label: 'Flat',
            value: 'Flat',
            description: 'Neutral sound balance',
            emoji: '🔉'
        },
        {
            label: 'Classical',
            value: 'Classical',
            description: 'Optimized for orchestras',
            emoji: '🎻'
        },
        {
            label: 'Club',
            value: 'Club',
            description: 'Boosted bass and treble',
            emoji: '🎵'
        },
        {
            label: 'Dance',
            value: 'Dance',
            description: 'High bass and treble',
            emoji: '💃'
        },
        {
            label: 'Full bass',
            value: 'FullBass',
            description: 'Maximized bass response',
            emoji: '🔊'
        },
        {
            label: 'Full bass & treble',
            value: 'FullBassTreble',
            description: 'Bass and treble boost',
            emoji: '🎵'
        },
        {
            label: 'Full treble',
            value: 'FullTreble',
            description: 'Maximized treble response',
            emoji: '🎶'
        },
        {
            label: 'Headphones',
            value: 'Headphones',
            description: 'Optimized for headphones',
            emoji: '🎧'
        },
        {
            label: 'Large hall',
            value: 'LargeHall',
            description: 'Echo effect for halls',
            emoji: '🏛️'
        },
        {
            label: 'Live',
            value: 'Live',
            description: 'Imitates live music',
            emoji: '🎤'
        },
        {
            label: 'Party',
            value: 'Party',
            description: 'Balanced for loudness',
            emoji: '🎉'
        },
        {
            label: 'Pop',
            value: 'Pop',
            description: 'Optimized for pop music',
            emoji: '🎤'
        },
        {
            label: 'Reggae',
            value: 'Reggae',
            description: 'Optimized for reggae music',
            emoji: '🎷'
        },
        {
            label: 'Rock',
            value: 'Rock',
            description: 'Optimized for rock music',
            emoji: '🎸'
        },
        {
            label: 'Ska',
            value: 'Ska',
            description: 'Optimized for ska music',
            emoji: '🎷'
        },
        {
            label: 'Soft',
            value: 'Soft',
            description: 'Softened sound balance',
            emoji: '🎶'
        },
        {
            label: 'Soft rock',
            value: 'SoftRock',
            description: 'Optimized for soft rock',
            emoji: '🎸'
        },
        {
            label: 'Techno',
            value: 'Techno',
            description: 'Optimized for techno music',
            emoji: '🎹'
        }
    ]
};

export const loadTestOptions = {
    enabled: false,
    trackUrl: 'https://www.youtube.com/watch?v=tTR4D9h3zAE',
    channelIdsToJoin: []
};
