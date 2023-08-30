import { EmbedBuilder, Message, SlashCommandBuilder } from 'discord.js';
import { BaseCommandInteraction, BaseSlashCommandParams } from '../../../types/interactionTypes';

export class TestCommandInteraction extends BaseCommandInteraction {
    constructor() {
        const data = new SlashCommandBuilder().setName('test').setDescription('Test command');
        super(data);
    }

    async execute(params: BaseSlashCommandParams): Promise<Message<boolean> | void> {
        const { executionId, interaction } = params;
        const logger = this.getLogger('test.js', executionId, interaction);

        logger.info('test command executed');
        logger.info(`${interaction.user.tag} executed test command`);
        logger.info(`Execution ID: ${executionId}`);

        logger.info(this.embedOptions.icons.success + ' Icon success from config.');
        return await interaction.editReply({
            embeds: [new EmbedBuilder().setDescription('It works!').setColor(this.embedOptions.colors.success)]
        });
    }
}

export default new TestCommandInteraction();
