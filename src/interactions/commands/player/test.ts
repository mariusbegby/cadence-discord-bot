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
        const logger = this.getLogger(this.commandName, executionId, interaction);

        // logic
    }
}

export default new TestCommand();
