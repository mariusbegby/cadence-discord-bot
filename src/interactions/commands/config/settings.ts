import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { BaseSlashCommandInteraction } from '../../../classes/interactions';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../../types/interactionTypes';
import { localizeCommand } from '../../../common/localeUtil';

class SettingsCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = localizeCommand(new SlashCommandBuilder().setName('settings'));
        super(data);
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, interaction } = params;
        const logger = this.getLogger(this.name, executionId, interaction);
        //const translator = useServerTranslator(interaction);

        logger.debug('Sending embed');
        return await interaction.editReply({
            embeds: [new EmbedBuilder().setDescription('Settings').setColor(this.embedOptions.colors.info)]
        });
    }
}

export default new SettingsCommand();
