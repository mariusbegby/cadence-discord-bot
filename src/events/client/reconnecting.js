const path = require('node:path');
const logger = require(path.resolve('./src/services/logger.js'));

module.exports = {
    name: 'reconnecting',
    isDebug: false,
    once: false,
    execute: async (client) => {
        logger.warn(`${client.user.tag} is reconnecting to Discord APIs.`);
    }
};
