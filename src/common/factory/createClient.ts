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
            intents: [Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildVoiceStates]
        });

        return client;
    } catch (error) {
        logger.error(error, 'Failed to create discord.js client');
        throw error;
    }
};
