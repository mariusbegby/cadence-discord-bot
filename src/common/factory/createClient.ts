import Discord, { Client } from 'discord.js';
import { loggerService, Logger } from '../services/logger';

export const createClient = async ({ executionId }: { executionId: string }): Promise<Client> => {
    const logger: Logger = loggerService.child({
        module: 'utilFactory',
        name: 'createClient',
        executionId: executionId,
        shardId: 'client'
    });

    try {
        logger.debug('Creating discord.js client...');

        const client: Client = new Discord.Client({
            intents: [Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildVoiceStates],
            makeCache: Discord.Options.cacheWithLimits({
                ...Discord.Options.DefaultMakeCacheSettings,
                AutoModerationRuleManager: 0,
                ApplicationCommandManager: 10,
                BaseGuildEmojiManager: 0,
                DMMessageManager: 0,
                GuildEmojiManager: 0,
                GuildMemberManager: 10,
                GuildBanManager: 0,
                GuildForumThreadManager: 10,
                GuildInviteManager: 0,
                GuildMessageManager: 10,
                GuildScheduledEventManager: 0,
                GuildStickerManager: 0,
                GuildTextThreadManager: 10,
                MessageManager: 10,
                PresenceManager: 0,
                ReactionManager: 0,
                ReactionUserManager: 0,
                StageInstanceManager: 0,
                ThreadManager: 0,
                ThreadMemberManager: 0,
                UserManager: 10,
                VoiceStateManager: 10
            }),
            sweepers: {
                ...Discord.Options.DefaultSweeperSettings,
                messages: {
                    interval: 1800,
                    lifetime: 900
                },
                users: {
                    interval: 1800,
                    filter: () => (user) => user.id !== client.user?.id
                },
                voiceStates: {
                    interval: 1800,
                    filter: () => (voiceState) => voiceState.member?.id !== client.user?.id
                }
            }
        });

        return client;
    } catch (error) {
        logger.error(error, 'Failed to create discord.js client');
        throw error;
    }
};
