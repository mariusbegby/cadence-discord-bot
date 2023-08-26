import https from 'node:https';

exports.postBotStats = async ({ client, executionId }) => {
    const logger = require('../../services/logger').child({
        source: 'postBotStats.js',
        module: 'utilOther',
        name: 'postBotStats',
        executionId: executionId,
        shardId: client.shard.ids[0]
    });

    try {
        if (client.shard.ids[0] !== 0) {
            return;
        }

        let guildCount = 0;
        let memberCount = 0;
        let shardCount = client.shard.count;
        let shardId = client.shard.ids[0];

        logger.debug('Gathering data about guild and member count from shards...');
        await client.shard
            .fetchClientValues('guilds.cache')
            .then((results) => {
                results.map((guildCache) => {
                    if (guildCache) {
                        guildCount += guildCache.length;
                        memberCount += guildCache.reduce((acc, guildCache) => acc + guildCache.memberCount, 0);
                    }
                });

                logger.debug('Successfully fetched client values from shards');
            })
            .catch((error) => {
                logger.error(error, 'Failed to fetch client values from shards.');
            });

        /* eslint-disable camelcase */
        const sites = [
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
                token: process.env.BOTLIST_TOP_GG_API_TOKEN
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
                token: process.env.BOTLIST_DISCORD_BOT_LIST_COM_API_TOKEN
            },
            {
                enabled: false,
                hostname: 'discords.com',
                path: `/bots/api/bot/${process.env.DISCORD_APPLICATION_ID}`,
                method: 'POST',
                body: {
                    server_count: guildCount
                },
                token: process.env.BOTLIST_DISCORDS_COM_API_TOKEN
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
                token: process.env.BOTLIST_DISCORD_BOTS_GG_API_TOKEN
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
                token: process.env.BOTLIST_BOTLIST_ME_API_TOKEN
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

        logger.info(`Starting to post bot stats with guild count ${guildCount} and member count ${memberCount}...`);

        let statusCodes = [];

        sites.map((site) => {
            if (site.disabled) {
                return;
            }

            let options = {
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

            let request = https.request(options, (res) => {
                res.statusCode === 200
                    ? logger.debug(`Request to ${site.hostname}: statusCode: ${res.statusCode}`)
                    : logger.warn(`Request to ${site.hostname}: statusCode: ${res.statusCode}`);

                statusCodes.push(res.statusCode);
            });

            request.write(JSON.stringify(site.body));
            request.end();
        });

        logger.info(`Successfully posted bot stats with status codes ${statusCodes.join(', ')}.`);
    } catch (error) {
        logger.error(error, 'Failed to post bot stats to sites.');
    }
};
