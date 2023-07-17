const path = require('node:path');
const logger = require(path.resolve('./src/services/logger.js'));
const https = require('node:https');
require('dotenv').config();

exports.postBotStats = (client) => {
    try {
        const guildCount = client.guilds.cache.size;

        /* eslint-disable camelcase */
        const sites = [
            {
                hostname: 'top.gg',
                path: `/api/bots/${process.env.DISCORD_CLIENT_ID}/stats`,
                method: 'POST',
                body: { server_count: guildCount },
                token: process.env.BOTLIST_TOP_GG_API_TOKEN
            },
            {
                hostname: 'discordbotlist.com',
                path: `/api/v1/bots/${process.env.DISCORD_CLIENT_ID}/stats`,
                method: 'POST',
                body: { guilds: guildCount },
                token: process.env.BOTLIST_DISCORD_BOT_LIST_COM_API_TOKEN
            },
            {
                hostname: 'discords.com',
                path: `/bots/api/bot/${process.env.DISCORD_CLIENT_ID}`,
                method: 'POST',
                body: { server_count: guildCount },
                token: process.env.BOTLIST_DISCORDS_COM_API_TOKEN
            },
            {
                hostname: 'discord.bots.gg',
                path: `/api/v1/bots/${process.env.DISCORD_CLIENT_ID}/stats`,
                method: 'POST',
                body: { guildCount: guildCount },
                token: process.env.BOTLIST_DISCORD_BOTS_GG_API_TOKEN
            },
            {
                hostname: 'api.botlist.me',
                path: `/api/v1/bots/${process.env.DISCORD_CLIENT_ID}/stats`,
                method: 'POST',
                body: { server_count: guildCount },
                token: process.env.BOTLIST_BOTLIST_ME_API_TOKEN
            },
            {
                hostname: 'api.discordlist.gg',
                path: `/v0/bots/${process.env.DISCORD_CLIENT_ID}/guilds?count=${guildCount}`,
                method: 'PUT',
                body: {},
                token: `Bearer ${process.env.BOTLIST_DISCORDLIST_GG_API_TOKEN}`
            }
        ];

        logger.info(`Posting stats to bot lists with guildCount ${guildCount}...`);
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
        logger.error(error, 'Failed to post stats to bot lists');
    }
};
