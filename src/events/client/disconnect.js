const path = require('node:path');
const logger = require(path.resolve('./src/services/logger.js'));

module.exports = {
    name: 'disconnect',
    isDebug: false,
    once: false,
    execute: async (client) => {
        logger.warn(`${client.user.tag} lost connection to Discord APIs. Disconnected.`);
    }
};
