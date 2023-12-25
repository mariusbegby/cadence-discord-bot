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
    privilegedRoles?: string[];
};

const guildDatabaseService = {
    async getAllGuilds(executionId: string, interaction?: Interaction | MessageComponentInteraction) {
        const logger = getLogger(executionId, interaction);
        logger.debug('Getting all guilds from database.');
        return await prisma.guild.findMany();
    },

    async getGuildSettings(
        guildId: string,
        executionId: string,
        interaction?: Interaction | MessageComponentInteraction
    ) {
        const logger = getLogger(executionId, interaction);
        logger.debug(`Getting settings for guild ${guildId} from database.`);
        const settings = await prisma.guildSettings.findUnique({
            where: { guildId: guildId }
        });

        if (!settings) {
            logger.debug(`No settings found for guild ${guildId}.`);
            return null;
        }

        const response = {
            ...settings,
            privilegedRoles: deserializeRoleIds(settings.privilegedRoles ?? '')
        };

        return response;
    },

    async createOrUpdateGuild(
        executionId: string,
        guildId: string,
        settingsData: GuildSettings,
        interaction?: Interaction | MessageComponentInteraction
    ) {
        const logger = getLogger(executionId, interaction);
        logger.debug(`Creating or updating guild ${guildId} in database.`);

        const validSettings = validateGuildSettings(logger, settingsData);
        return await prisma.guild.upsert({
            where: { guildId: guildId },
            update: {
                settings: {
                    update: validSettings
                }
            },
            create: {
                guildId: guildId,
                settings: {
                    create: {
                        ...validSettings,
                        guildId: guildId
                    }
                }
            }
        });
    },

    async updateGuildSettings(
        executionId: string,
        guildId: string,
        settingsData: GuildSettings,
        interaction?: Interaction | MessageComponentInteraction
    ) {
        const logger = getLogger(executionId, interaction);
        logger.debug(`Updating settings for guild ${guildId} in database.`);
        const validSettings = validateGuildSettings(logger, settingsData);
        return await prisma.guildSettings.update({
            where: {
                guildId: guildId
            },
            data: validSettings
        });
    },

    async deleteGuildAndSettings(
        executionId: string,
        guildId: string,
        interaction?: Interaction | MessageComponentInteraction
    ) {
        const logger = getLogger(executionId, interaction);
        logger.debug(`Deleting guild ${guildId} and settings from database.`);

        return await prisma.$transaction(async (prisma) => {
            await prisma.guildSettings.delete({
                where: { guildId: guildId }
            });

            await prisma.guild.delete({
                where: { guildId: guildId }
            });
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

    if (settingsData.privilegedRoles && !settingsData.privilegedRoles.every((role) => role.match(/\d{18}/))) {
        logger.debug('privilegedRoles contains invalid Discord role IDs');
        throw new Error('privilegedRoles contains invalid Discord role IDs');
    }

    const validSettings = {
        defaultVolume: settingsData.defaultVolume,
        locale: settingsData.locale,
        privilegedRoles: serializeRoleIds(settingsData.privilegedRoles ?? [])
    };

    return validSettings;
}

function serializeRoleIds(roleIds: string[]): string {
    return roleIds.join(',');
}

function deserializeRoleIds(serializedRoles: string): string[] {
    return serializedRoles.split(',').filter((role) => role.trim() !== '');
}

export default guildDatabaseService;
