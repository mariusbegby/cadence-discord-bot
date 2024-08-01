import { REST, type RESTPostAPIChatInputApplicationCommandsJSONBody, type RouteLike, Routes } from 'discord.js';
import 'dotenv/config';
import { randomUUID as uuidv4 } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { Logger } from '../common/services/logger';
import type { BaseSlashCommandInteraction } from '../common/classes/interactions';
import { loggerService } from '../common/services/logger';

const executionId: string = uuidv4();
const logger: Logger = loggerService.child({
    module: 'deploy',
    name: 'deploySlashCommands',
    executionId: executionId
});

const slashCommands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

if (!process.env.DISCORD_BOT_TOKEN) {
    throw new Error('DISCORD_BOT_TOKEN environment variable is not set.');
}

if (!process.env.DISCORD_APPLICATION_ID) {
    throw new Error('DISCORD_APPLICATION_ID environment variable is not set.');
}

const rest: REST = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
    if (!process.env.DISCORD_APPLICATION_ID || !process.env.DISCORD_BOT_TOKEN) {
        logger.error(
            'Missing required environment variables for deployment.\nPlease provide valid DISCORD_APPLICATION_ID and DISCORD_BOT_TOKEN in .env file.'
        );
        process.exit(1);
    }

    const commandFiles: string[] = fs
        .readdirSync(path.resolve('./dist/interactions/slashcommands'))
        .filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
        const { default: command } = await import(`../interactions/slashcommands/${file}`);
        const slashCommand = command as BaseSlashCommandInteraction;
        slashCommands.push(slashCommand.data.toJSON());
    }

    try {
        logger.debug(`Bot user slash commands found: ${slashCommands.map((command) => `/${command.name}`).join(', ')}`);

        logger.info('Started refreshing user slash commands.');
        await refreshCommands(Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID), slashCommands);
        logger.info('Successfully refreshed user slash commands.');
    } catch (error) {
        logger.error(error, 'Failed to refresh user slash commands.');
    }
})();

async function refreshCommands(route: RouteLike, commands: RESTPostAPIChatInputApplicationCommandsJSONBody[]) {
    // Deploying Discord Commands, Runs POST call for each command Synchronously
    logger.info('Deploying commands...');
    await rest.put(route, { body: commands });
}
