import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import {
    BaseSlashCommandInteraction,
    BaseSlashCommandParams,
    BaseSlashCommandReturnType
} from '../../../types/interactionTypes';

class TestCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = new SlashCommandBuilder()
            .setName('test')
            .setDescription('This is a test command description lorem ipsum.');
        super(data);
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, interaction } = params;
        const logger = this.getLogger('test.js', executionId, interaction);

        logger.debug('Responding with success embed.');
        return await interaction.editReply({
            embeds: [new EmbedBuilder().setDescription(`Success reply from command '${this.commandName}'.`).setColor(this.embedOptions.colors.success)]
        });
    }
}

export default new TestCommand();
