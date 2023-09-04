import { SlashCommandBuilder } from 'discord.js';
import { EmbedContext, InfoEmbed } from '../../../classes/embeds';
import { BaseSlashCommandInteraction } from '../../../classes/interactions';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../../types/interactionTypes';

class TestCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = new SlashCommandBuilder().setName('test').setDescription('Test command.');
        super(data);
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, interaction } = params;
        const logger = this.getLogger(this.name, executionId, interaction);

        const embedContext: EmbedContext = {
            title: 'Test title',
            description: 'This is a test embed.',
            author: {
                name: 'Test author',
                iconURL: 'https://cdn.discordapp.com/embed/avatars/0.png'
            },
            footer: {
                text: 'Test footer',
                iconURL: 'https://cdn.discordapp.com/embed/avatars/0.png'
            },
            thumbnail: 'https://cdn.discordapp.com/embed/avatars/0.png',
            fields: [
                {
                    name: 'Test field',
                    value: 'Test field value',
                    inline: false
                }
            ]
        };

        logger.debug('Responding with info embed.');
        return new InfoEmbed(interaction, embedContext).send();
    }
}

export default new TestCommand();
