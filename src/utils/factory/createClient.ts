import Discord, { Client } from 'discord.js';
import { Logger } from 'pino';
import loggerModule from '../../services/logger';

export const createClient = async ({ executionId }: { executionId: string }): Promise<Client> => {
    const logger: Logger = loggerModule.child({
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
                MessageManager: 25,
                ThreadManager: 25,
                PresenceManager: 0,
                ReactionManager: 0,
                GuildMemberManager: {
                    maxSize: 50,
                    keepOverLimit: (member) => member.id === client.user?.id
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
                    filter: () => (user) => user.id !== client.user?.id
                }
            }
        });

        return client;
    } catch (error) {
        logger.error(error, 'Failed to create discord.js client');
        throw error;
    }
};
