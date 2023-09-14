import { Client } from 'discord.js';
import { ClientRequest, ClientRequestArgs, IncomingMessage } from 'node:http';
import https from 'node:https';
import { Logger } from 'pino';
import loggerModule from '../../services/logger';
import { PostBotStatsParams, PostBotStatsSite } from '../../types/utilTypes';
import { fetchTotalGuildStatistics } from '../shardUtils';

export const postBotStats = async ({ client, executionId }: PostBotStatsParams) => {
    const logger: Logger = loggerModule.child({
        module: 'utilOther',
        name: 'postBotStats',
        executionId: executionId,
        shardId: client.shard?.ids[0]
    });

    const shardId: number = client.shard!.ids[0];

    if (shardId !== 0) {
        return;
    }

    if (process.env.NODE_ENV !== 'production') {
        logger.debug('Not posting bot stats because NODE_ENV is not production.');
        return;
    }

    const shardCount: number = client.shard!.count;
    const { guildCount, memberCount } = await fetchGuildAndMemberCounts(client, logger);

    const botSites: PostBotStatsSite[] = createSites(shardId, shardCount, guildCount, memberCount);

    try {
        const enabledSites = botSites.filter((site) => site.enabled);

        if (enabledSites.length === 0) {
            logger.debug('No sites are enabled. Not posting bot stats.');
            return;
        }

        logger.info(
            `Starting to post bot stats with guild count ${guildCount} and member count ${memberCount} for ${enabledSites.length} sites...`
        );

        await postStatsToSites(enabledSites, logger);
    } catch (error) {
        logger.error(error, 'Failed to post bot stats to sites.');
    }
};

async function fetchGuildAndMemberCounts(client: Client, logger: Logger) {
    let guildCount = 0;
    let memberCount = 0;

    try {
        logger.debug('Gathering data about guild and member count from shards...');
        const { totalGuildCount, totalMemberCount } = await fetchTotalGuildStatistics(client);
        guildCount = totalGuildCount;
        memberCount = totalMemberCount;
    } catch (error) {
        logger.error(error, 'Failed to gather data about guild and member count from shards.');
    }

    return { guildCount, memberCount };
}

async function postStatsToSites(enabledSites: PostBotStatsSite[], logger: Logger) {
    const statusPromises = enabledSites.map((site) => {
        return new Promise<number | null>((resolve, reject) => {
            const options: ClientRequestArgs = {
                protocol: 'https:',
                hostname: site.hostname,
                port: 443,
                path: site.path,
                method: site.method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: site.token
                }
            };

            const request: ClientRequest = https.request(options, (res) => {
                const statusCode = handleResponse(res, site, logger);
                resolve(statusCode);
            });

            request.on('error', (error) => {
                logger.error(error, `Request to ${site.hostname} failed.`);
                reject(error);
            });

            request.write(JSON.stringify(site.body));
            request.end();
        });
    });

    const statusCodes = await Promise.all(statusPromises);
    logger.info(`Successfully posted bot stats with status codes ${statusCodes.join(', ')}.`);
}

function handleResponse(res: IncomingMessage, site: PostBotStatsSite, logger: Logger): number | null {
    if (typeof res.statusCode === 'number') {
        res.statusCode === 200
            ? logger.debug(`Request to ${site.hostname}: statusCode: ${res.statusCode}`)
            : logger.warn(`Request to ${site.hostname}: statusCode: ${res.statusCode}`);
        return res.statusCode;
    } else {
        logger.error(`Request to ${site.hostname}: statusCode is undefined or not a number (${res.statusCode}).`);
        return null;
    }
}

function createSites(shardId: number, shardCount: number, guildCount: number, memberCount: number): PostBotStatsSite[] {
    /* eslint-disable camelcase */
    return [
        {
            enabled: process.env.BOTLIST_TOP_GG_API_TOKEN ? true : false,
            hostname: 'top.gg',
            path: `/api/bots/${process.env.DISCORD_APPLICATION_ID}/stats`,
            method: 'POST',
            body: {
                shard_id: shardId,
                shard_count: shardCount,
                server_count: guildCount
            },
            token: process.env.BOTLIST_TOP_GG_API_TOKEN ?? ''
        },
        {
            enabled: process.env.BOTLIST_DISCORD_BOT_LIST_COM_API_TOKEN ? true : false,
            hostname: 'discordbotlist.com',
            path: `/api/v1/bots/${process.env.DISCORD_APPLICATION_ID}/stats`,
            method: 'POST',
            body: {
                shard_id: shardId,
                users: memberCount,
                guilds: guildCount
            },
            token: process.env.BOTLIST_DISCORD_BOT_LIST_COM_API_TOKEN ?? ''
        },
        {
            enabled: process.env.BOTLIST_DISCORDS_COM_API_TOKEN ? true : false,
            hostname: 'discords.com',
            path: `/bots/api/bot/${process.env.DISCORD_APPLICATION_ID}`,
            method: 'POST',
            body: {
                server_count: guildCount
            },
            token: process.env.BOTLIST_DISCORDS_COM_API_TOKEN ?? ''
        },
        {
            enabled: process.env.BOTLIST_DISCORD_BOTS_GG_API_TOKEN ? true : false,
            hostname: 'discord.bots.gg',
            path: `/api/v1/bots/${process.env.DISCORD_APPLICATION_ID}/stats`,
            method: 'POST',
            body: {
                shardId: shardId,
                shardCount: shardCount,
                guildCount: guildCount
            },
            token: process.env.BOTLIST_DISCORD_BOTS_GG_API_TOKEN ?? ''
        },
        {
            enabled: process.env.BOTLIST_BOTLIST_ME_API_TOKEN ? true : false,
            hostname: 'api.botlist.me',
            path: `/api/v1/bots/${process.env.DISCORD_APPLICATION_ID}/stats`,
            method: 'POST',
            body: {
                shard_count: shardCount,
                server_count: guildCount
            },
            token: process.env.BOTLIST_BOTLIST_ME_API_TOKEN ?? ''
        },
        {
            enabled: process.env.BOTLIST_DISCORDLIST_GG_API_TOKEN ? true : false,
            hostname: 'api.discordlist.gg',
            path: `/v0/bots/${process.env.DISCORD_APPLICATION_ID}/guilds`,
            method: 'POST',
            body: {
                count: guildCount
            },
            token: `Bearer ${process.env.BOTLIST_DISCORDLIST_GG_API_TOKEN}`
        },
        {
            enabled: process.env.BOTLIST_DISCORD_BOTLIST_EU_API_TOKEN ? true : false,
            hostname: 'api.discord-botlist.eu',
            path: '/v1/update',
            method: 'PATCH',
            body: {
                serverCount: guildCount
            },
            token: `Bearer ${process.env.BOTLIST_DISCORD_BOTLIST_EU_API_TOKEN}`
        }
    ];
}
