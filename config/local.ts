export const shardingOptions = {
    totalShards: 2,
    shardList: 'auto',
    mode: 'process',
    respawn: true
};

export const loggerOptions = {
    minimumLogLevel: 'debug',
    minimumLogLevelConsole: 'debug',
    discordPlayerDebug: false
};

export const loadTestOptions = {
    enabled: false,
    trackUrl: 'https://www.youtube.com/watch?v=RkbSvbJijNU',
    channelIdsToJoin: [
        '1131669527676068034',
        '1131669572995526659',
        '1131669628624580681',
        '1131669675525283933',
        '1131669720534368278',
        '1131669758840942632',
        '1131669790365327393',
        '1131669858405318679',
        '1131669897789845608',
        '1131669929792393341',
        '1133345622922100761',
        '1133345676193964137',
        '1133345709756780555',
        '1133345752563847192',
        '1133345783165501454',
        '1133345811892281430',
        '1133345841105621025',
        '1133345870822260880',
        '1133345897888088137',
        '1133345935624241165'
    ]
};

export const systemOptions = {
    // Channel for sending system messages, such as bot errors and disconnect events. e.g. '123456789012345678'
    systemMessageChannelId: '',
    // Bot administrator user ID for specific notifications through mentions in system channel. e.g. '123456789012345678'
    systemUserId: ''
};
