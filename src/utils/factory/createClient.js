const logger = require('../../services/logger');
const Discord = require('discord.js');

exports.createClient = async () => {
    try {
        logger.info('Creating Discord.js client...');

        const client = new Discord.Client({
            intents: [Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildVoiceStates],
            makeCache: Discord.Options.cacheWithLimits({
                ...Discord.Options.DefaultMakeCacheSettings,
                MessageManager: 25,
                ThreadManager: 25,
                PresenceManager: 0,
                ReactionManager: 0,
                GuildMemberManager: {
                    maxSize: 50,
                    keepOverLimit: (member) => member.id === client.user.id
                }
            }),
            sweepers: {
                ...Discord.Options.DefaultSweeperSettings,
                messages: {
                    interval: 3600,
                    lifetime: 1800
                },
                users: {
                    interval: 3600,
                    filter: () => (user) => user.id !== client.user.id
                }
            }
        });
        return client;
    } catch (error) {
        logger.error('Failed to create Discord.js client', error);
        throw error;
    }
};
