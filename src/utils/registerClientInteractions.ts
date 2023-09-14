import { Collection } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { Logger } from 'pino';
import loggerModule from '../services/logger';
import { ExtendedClient } from '../types/clientTypes';
import { RegisterClientInteractionsParams } from '../types/utilTypes';

export const registerClientInteractions = async ({ client, executionId }: RegisterClientInteractionsParams) => {
    const logger: Logger = loggerModule.child({
        module: 'register',
        name: 'registerClientInteractions',
        executionId: executionId,
        shardId: client.shard?.ids[0]
    });

    await registerSlashCommandInteractions(logger, client);
    await registerAutocompleteInteractions(logger, client);
    await registerComponentInteractions(logger, client);

    logger.debug('Registering all client interactions complete.');
};

async function registerSlashCommandInteractions(logger: Logger, client: ExtendedClient): Promise<void> {
    logger.debug('Registering client slash command interactions...');
    client.slashCommandInteractions = new Collection();

    const baseFolderPath = './dist/interactions/commands';
    const slashCommandInteractionFolders: string[] = fs.readdirSync(path.resolve(baseFolderPath));

    for (const categoryFolder of slashCommandInteractionFolders) {
        logger.trace(`Registering client commands for folder '${categoryFolder}'...`);

        const files: string[] = fs
            .readdirSync(path.resolve(`${baseFolderPath}/${categoryFolder}`))
            .filter((file) => file.endsWith('.js'));

        for (const file of files) {
            try {
                const filePath = path.resolve(`${baseFolderPath}/${categoryFolder}/${file}`);

                // delete require cache for file
                delete require.cache[filePath];

                // import and register to client collection
                const { default: slashCommandInteraction } = await import(filePath);
                client.slashCommandInteractions.delete(slashCommandInteraction.name);
                client.slashCommandInteractions.set(slashCommandInteraction.name, slashCommandInteraction);
            } catch (error) {
                if (error instanceof Error) {
                    logger.error(
                        `Error registering slash command interaction '${categoryFolder}/${file}': ${error.message}`
                    );
                } else {
                    throw error;
                }
            }
        }
    }

    logger.trace('Registering client slash command interactions complete.');
}

async function registerAutocompleteInteractions(logger: Logger, client: ExtendedClient): Promise<void> {
    logger.debug('Registering client autocomplete interactions...');
    client.autocompleteInteractions = new Collection();

    const baseFolderPath = './dist/interactions/autocomplete';
    const files: string[] = fs.readdirSync(path.resolve(`${baseFolderPath}`)).filter((file) => file.endsWith('.js'));

    for (const file of files) {
        try {
            const filePath = path.resolve(`${baseFolderPath}/${file}`);

            // delete require cache for file
            delete require.cache[filePath];

            // import and register to client collection
            const { default: autocompleteInteraction } = await import(filePath);
            client.autocompleteInteractions.delete(autocompleteInteraction.name);
            client.autocompleteInteractions.set(autocompleteInteraction.name, autocompleteInteraction);
        } catch (error) {
            if (error instanceof Error) {
                logger.error(`Error registering autocomplete interaction '${file}': ${error.message}`);
            } else {
                throw error;
            }
        }
    }

    logger.trace('Registering client autocomplete interactions complete.');
}

async function registerComponentInteractions(logger: Logger, client: ExtendedClient): Promise<void> {
    logger.debug('Registering client component interactions...');
    client.componentInteractions = new Collection();

    const baseFolderPath = './dist/interactions/components';
    const files: string[] = fs.readdirSync(path.resolve(`${baseFolderPath}`)).filter((file) => file.endsWith('.js'));

    for (const file of files) {
        try {
            const filePath = path.resolve(`${baseFolderPath}/${file}`);

            // delete require cache for file
            delete require.cache[filePath];

            // import and register to client collection
            const { default: componentInteraction } = await import(filePath);
            client.componentInteractions.delete(componentInteraction.name);
            client.componentInteractions.set(componentInteraction.name, componentInteraction);
        } catch (error) {
            if (error instanceof Error) {
                logger.error(`Error registering component interaction '${file}': ${error.message}`);
            } else {
                throw error;
            }
        }
    }

    logger.trace('Registering client component interactions complete.');
}
