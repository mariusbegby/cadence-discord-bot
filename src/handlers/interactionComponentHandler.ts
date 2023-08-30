import { MessageComponentInteraction } from 'discord.js';
import { Logger } from 'pino';
import loggerModule from '../services/logger';
import { cannotSendMessageInChannel } from '../utils/validation/permissionValidator';

export const handleComponent = async (interaction: MessageComponentInteraction, executionId: string) => {
    const logger: Logger = loggerModule.child({
        source: 'interactionComponentHandler.js',
        module: 'handler',
        name: 'interactionComponentHandler',
        executionId: executionId
    });

    await interaction.deferReply();
    logger.debug('Interaction deferred.');

    const componentId: string = interaction.customId.split('_')[0];
    const referenceId: string = interaction.customId.split('_')[1];

    logger.debug(`Parsed componentId: ${componentId}`);

    if (await cannotSendMessageInChannel({ interaction, executionId })) {
        return;
    }

    // TODO: Create TS Type for component
    const componentModule = await import(`../interactions/components/${componentId}.js`);
    const { default: component } = componentModule;

    logger.debug('Executing component interaction.');
    await component.execute({ interaction, referenceId, executionId });
};
