import { usePrismaClient } from './prismaClient';
import { loggerService, Logger } from './logger';
import { Interaction, MessageComponentInteraction } from 'discord.js';

const prisma = usePrismaClient();

function getLogger(executionId: string, interaction?: Interaction | MessageComponentInteraction): Logger {
    return loggerService.child({
        module: 'databaseService',
        name: 'guildDatabaseService',
        executionId: executionId,
        shardId: interaction?.guild?.shardId ?? 'N/A'
    });
}

export type GuildConfig = {
    defaultVolume?: number;
    locale?: string;
    actionPermissions?: Record<string, string[]>;
};

const guildDatabaseClient = {
    async getGuildConfig(
        guildId: string,
        executionId: string,
        interaction?: Interaction | MessageComponentInteraction
    ) {
        const logger = getLogger(executionId, interaction);
        logger.debug(`Getting config for guild ${guildId} from database.`);
        const config = await prisma.guildConfig.findUnique({
            where: { guildId: guildId }
        });

        if (!config) {
            logger.debug(`No config found for guild ${guildId}.`);
            return null;
        }

        const response = {
            ...config,
            actionPermissions: deserializeActionPermissions(config.actionPermissions ?? '')
        };

        return response;
    },

    async createOrUpdateGuildConfig(
        executionId: string,
        guildId: string,
        configData: GuildConfig,
        interaction?: Interaction | MessageComponentInteraction
    ) {
        const logger = getLogger(executionId, interaction);
        logger.debug(`Creating or updating guild config for guild ${guildId} in database.`);

        const validConfig = validateGuildConfig(logger, configData);
        return await prisma.guildConfig.upsert({
            where: { guildId: guildId },
            update: {
                ...validConfig
            },
            create: {
                guildId: guildId,
                ...validConfig
            }
        });
    },

    async deleteGuildConfig(
        executionId: string,
        guildId: string,
        interaction?: Interaction | MessageComponentInteraction
    ) {
        const logger = getLogger(executionId, interaction);
        logger.debug(`Deleting guild ${guildId} and config from database.`);

        return await prisma.guildConfig.delete({
            where: { guildId: guildId }
        });
    }
};

export function validateGuildConfig(logger: Logger, configData: GuildConfig) {
    if (configData.defaultVolume && (configData.defaultVolume < 0 || configData.defaultVolume > 100)) {
        logger.debug(`defaultVolume ${configData.defaultVolume} is not between 0 and 100`);
        throw new Error('defaultVolume must be between 0 and 100');
    }

    // get available locale from i18next?
    if (configData.locale && !['en-US', 'no', 'ro', 'en-ES'].includes(configData.locale)) {
        logger.debug(`locale ${configData.locale} is not in list of available locales`);
        throw new Error(`locale ${configData.locale} is not in list of available locales`);
    }

    // TODO: validate actionPermissions

    const validConfig = {
        defaultVolume: configData.defaultVolume,
        locale: configData.locale,
        actionPermissions: serializeActionPermissions(configData.actionPermissions ?? {})
    };

    return validConfig;
}

function serializeActionPermissions(permissions: Record<string, string[]>): string {
    return JSON.stringify(permissions);
}

function deserializeActionPermissions(serializedPermissions: string): Record<string, string[]> {
    return JSON.parse(serializedPermissions);
}

export default guildDatabaseClient;
