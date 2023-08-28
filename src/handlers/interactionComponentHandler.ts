import { MessageComponentInteraction } from 'discord.js';
import loggerModule from '../services/logger';

const logger = loggerModule.child({
    source: 'interactionComponentHandler.js',
    module: 'handler',
    name: 'interactionComponentHandler'
});

export const handleComponent = async (interaction: MessageComponentInteraction, executionId: string) => {
    await interaction.deferReply();
    logger.debug('Interaction deferred.');

    const componentId = interaction.customId.split('_')[0];
    const referenceId = interaction.customId.split('_')[1];

    logger.debug(`Parsed componentId: ${componentId}`);

    const componentModule = await import(`../interactions/components/${componentId}.js`);
    const { default: component } = componentModule;

    logger.debug('Executing component interaction.');
    await component.execute({ interaction, referenceId, executionId });
};
