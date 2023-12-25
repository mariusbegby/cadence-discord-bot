import { getPrismaClient } from './prismaClient';
import loggerModule from './logger';
import { Logger } from 'pino';
import { Interaction, MessageComponentInteraction } from 'discord.js';

const prisma = getPrismaClient();

function getLogger(executionId: string, interaction?: Interaction | MessageComponentInteraction): Logger {
    return loggerModule.child({
        module: 'databaseService',
        name: 'guildDatabaseService',
        executionId: executionId,
        shardId: interaction?.guild?.shardId ?? 'N/A'
    });
}

export type GuildSettings = {
    defaultVolume?: number;
    locale?: string;
    actionPermissions?: Record<string, string[]>;
};

const guildDatabaseService = {
    async getGuildSettings(
        guildId: string,
        executionId: string,
        interaction?: Interaction | MessageComponentInteraction
    ) {
        const logger = getLogger(executionId, interaction);
        logger.debug(`Getting settings for guild ${guildId} from database.`);
        const settings = await prisma.guildSetting.findUnique({
            where: { guildId: guildId }
        });

        if (!settings) {
            logger.debug(`No settings found for guild ${guildId}.`);
            return null;
        }

        const response = {
            ...settings,
            actionPermissions: deserializeActionPermissions(settings.actionPermissions ?? '')
        };

        return response;
    },

    async createOrUpdateGuildSettings(
        executionId: string,
        guildId: string,
        settingsData: GuildSettings,
        interaction?: Interaction | MessageComponentInteraction
    ) {
        const logger = getLogger(executionId, interaction);
        logger.debug(`Creating or updating guild settings for guild ${guildId} in database.`);

        const validSettings = validateGuildSettings(logger, settingsData);
        return await prisma.guildSetting.upsert({
            where: { guildId: guildId },
            update: {
                ...validSettings
            },
            create: {
                guildId: guildId,
                ...validSettings
            }
        });
    },

    async deleteGuildSettings(
        executionId: string,
        guildId: string,
        interaction?: Interaction | MessageComponentInteraction
    ) {
        const logger = getLogger(executionId, interaction);
        logger.debug(`Deleting guild ${guildId} and settings from database.`);

        return await prisma.guildSetting.delete({
            where: { guildId: guildId }
        });
    }
};

export function validateGuildSettings(logger: Logger, settingsData: GuildSettings) {
    if (settingsData.defaultVolume && (settingsData.defaultVolume < 0 || settingsData.defaultVolume > 100)) {
        logger.debug(`defaultVolume ${settingsData.defaultVolume} is not between 0 and 100`);
        throw new Error('defaultVolume must be between 0 and 100');
    }

    // get available locale from i18next?
    if (settingsData.locale && !['en-US', 'no', 'ro', 'en-ES'].includes(settingsData.locale)) {
        logger.debug(`locale ${settingsData.locale} is not in list of available locales`);
        throw new Error(`locale ${settingsData.locale} is not in list of available locales`);
    }

    // TODO: validate actionPermissions

    const validSettings = {
        defaultVolume: settingsData.defaultVolume,
        locale: settingsData.locale,
        actionPermissions: serializeActionPermissions(settingsData.actionPermissions ?? {})
    };

    return validSettings;
}

function serializeActionPermissions(permissions: Record<string, string[]>): string {
    return JSON.stringify(permissions);
}

function deserializeActionPermissions(serializedPermissions: string): Record<string, string[]> {
    return JSON.parse(serializedPermissions);
}

export default guildDatabaseService;
