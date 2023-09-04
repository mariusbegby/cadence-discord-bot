import { Guild } from 'discord.js';
import { ClientRequest, ClientRequestArgs } from 'node:http';
import https from 'node:https';
import { Logger } from 'pino';
import loggerModule from '../../services/logger';
import { PostBotStatsParams, PostBotStatsSite } from '../../types/utilTypes';

export const postBotStats = async ({ client, executionId }: PostBotStatsParams) => {
    const logger: Logger = loggerModule.child({
        module: 'utilOther',
        name: 'postBotStats',
        executionId: executionId,
        shardId: client.shard?.ids[0]
    });

    if (client.shard?.ids[0] !== 0) {
        return;
    }

    let guildCount: number = 0;
    let memberCount: number = 0;
    const shardCount: number = client.shard.count;
    const shardId: number = client.shard.ids[0];

    try {
        logger.debug('Gathering data about guild and member count from shards...');
        await client!
            .shard!.fetchClientValues('guilds.cache')
            .then((results) => {
                const guildCaches: Guild[][] = results as Guild[][];
                guildCaches.map((guildCache: Guild[]) => {
                    if (guildCache) {
                        guildCount += guildCache.length;
                        memberCount += guildCache.reduce((acc: number, guild: Guild) => acc + guild.memberCount, 0);
                    }
                });

                logger.debug('Successfully fetched client values from shards.');
            })
            .catch((error) => {
                logger.error(error, 'Failed to fetch client values from shards.');
            });
    } catch (error) {
        logger.error(error, 'Failed to gather data about guild and member count from shards.');
    }

    logger.info(`Starting to post bot stats with guild count ${guildCount} and member count ${memberCount}...`);

    /* eslint-disable camelcase */
    const sites: PostBotStatsSite[] = [
        {
            enabled: false,
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
            enabled: false,
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
            enabled: false,
            hostname: 'discords.com',
            path: `/bots/api/bot/${process.env.DISCORD_APPLICATION_ID}`,
            method: 'POST',
            body: {
                server_count: guildCount
            },
            token: process.env.BOTLIST_DISCORDS_COM_API_TOKEN ?? ''
        },
        {
            enabled: false,
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
            enabled: false,
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
            enabled: false,
            hostname: 'api.discordlist.gg',
            path: `/v0/bots/${process.env.DISCORD_APPLICATION_ID}/guilds`,
            method: 'POST',
            body: {
                count: guildCount
            },
            token: `Bearer ${process.env.BOTLIST_DISCORDLIST_GG_API_TOKEN}`
        },
        {
            enabled: false,
            hostname: 'api.discord-botlist.eu',
            path: '/v1/update',
            method: 'PATCH',
            body: {
                serverCount: guildCount
            },
            token: `Bearer ${process.env.BOTLIST_DISCORD_BOTLIST_EU_API_TOKEN}`
        }
    ];

    try {
        const statusPromises = sites.map((site) => {
            return new Promise<number | null>((resolve) => {
                if (!site.enabled) {
                    // return if site is disabled
                    resolve(null);
                    return;
                }

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
                    if (typeof res.statusCode === 'number') {
                        res.statusCode === 200
                            ? logger.debug(`Request to ${site.hostname}: statusCode: ${res.statusCode}`)
                            : logger.warn(`Request to ${site.hostname}: statusCode: ${res.statusCode}`);
                        resolve(res.statusCode);
                    } else {
                        logger.error(
                            `Request to ${site.hostname}: statusCode is undefined or not a number (${res.statusCode}).`
                        );
                        resolve(null);
                    }
                });

                request.write(JSON.stringify(site.body));
                request.end();
            });
        });

        const statusCodes = await Promise.all(statusPromises);
        logger.info(
            `Successfully posted bot stats with status codes ${statusCodes.filter((code) => code !== null).join(', ')}.`
        );
    } catch (error) {
        logger.error(error, 'Failed to post bot stats to sites.');
    }
};
