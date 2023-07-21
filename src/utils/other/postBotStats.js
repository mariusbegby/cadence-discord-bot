const logger = require('../../services/logger');
const https = require('node:https');

exports.postBotStats = async (client) => {
    try {
        if (client.shard.ids[0] !== 0) {
            return logger.debug(`[Shard ${client.shard.ids[0]}] Shard is not the first shard, not posting stats.`);
        }

        logger.debug(
            client.shard.ids,
            `[Shard ${client.shard.ids[0]}] Posting stats to bot lists from client with shard id 0.`
        );

        let guildCount = 0;

        await client.shard
            .fetchClientValues('guilds.cache.size')
            .then((results) => {
                guildCount = results.reduce((acc, guildCount) => acc + guildCount, 0);
            })
            .catch((error) => {
                logger.error(error, `[Shard ${client.shard.ids[0]}] Failed to fetch client values from shards.`);
            });

        /* eslint-disable camelcase */
        const sites = [
            {
                hostname: 'top.gg',
                path: `/api/bots/${process.env.DISCORD_APPLICATION_ID}/stats`,
                method: 'POST',
                body: { server_count: guildCount },
                token: process.env.BOTLIST_TOP_GG_API_TOKEN
            },
            {
                hostname: 'discordbotlist.com',
                path: `/api/v1/bots/${process.env.DISCORD_APPLICATION_ID}/stats`,
                method: 'POST',
                body: { guilds: guildCount },
                token: process.env.BOTLIST_DISCORD_BOT_LIST_COM_API_TOKEN
            },
            {
                hostname: 'discords.com',
                path: `/bots/api/bot/${process.env.DISCORD_APPLICATION_ID}`,
                method: 'POST',
                body: { server_count: guildCount },
                token: process.env.BOTLIST_DISCORDS_COM_API_TOKEN
            },
            {
                hostname: 'discord.bots.gg',
                path: `/api/v1/bots/${process.env.DISCORD_APPLICATION_ID}/stats`,
                method: 'POST',
                body: { guildCount: guildCount },
                token: process.env.BOTLIST_DISCORD_BOTS_GG_API_TOKEN
            },
            {
                hostname: 'api.botlist.me',
                path: `/api/v1/bots/${process.env.DISCORD_APPLICATION_ID}/stats`,
                method: 'POST',
                body: { server_count: guildCount },
                token: process.env.BOTLIST_BOTLIST_ME_API_TOKEN
            },
            {
                hostname: 'api.discordlist.gg',
                path: `/v0/bots/${process.env.DISCORD_APPLICATION_ID}/guilds?count=${guildCount}`,
                method: 'PUT',
                body: {},
                token: `Bearer ${process.env.BOTLIST_DISCORDLIST_GG_API_TOKEN}`
            }
        ];

        logger.info(`[Shard ${client.shard.ids[0]}] Posting stats to bot lists with guildCount ${guildCount}...`);
        sites.map((site) => {
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
                    ? logger.info(`Request to ${site.hostname}: statusCode: ${res.statusCode}`)
                    : logger.warn(`Request to ${site.hostname}: statusCode: ${res.statusCode}`);
            });

            request.write(JSON.stringify(site.body));
            request.end();
        });
    } catch (error) {
        logger.error(error, `[Shard ${client.shard.ids[0]}] Failed to post stats to bot lists.`);
    }
};
