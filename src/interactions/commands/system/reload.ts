import { ApplicationCommandOption, ApplicationCommandOptionData, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { ExtendedClient } from '../../../types/clientTypes';
import {
    BaseSlashCommandInteraction,
    BaseSlashCommandParams,
    BaseSlashCommandReturnType
} from '../../../types/interactionTypes';
import { notValidGuildId } from '../../../utils/validation/systemCommandValidator';

class ReloadCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = new SlashCommandBuilder()
            .setName('reload')
            .setDescription('Reload all slash commands across shards.');
        const isSystemCommand: boolean = true;
        super(data, isSystemCommand);
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, interaction, client } = params;
        const logger = this.getLogger(this.name, executionId, interaction);

        if (await notValidGuildId({ interaction, executionId })) {
            return;
        }

        try {
            logger.debug('Reloading commands across all shards.');
            await client!
                .shard!.broadcastEval(
                    async (shardClient: ExtendedClient, { executionId }) => {
                        shardClient.registerClientCommands!({ client: shardClient, executionId });
                    },
                    { context: { executionId: executionId } }
                )
                .then(() => {
                    logger.debug('Successfully reloaded commands across all shards.');
                });
        } catch (error) {
            logger.error(error, 'Failed to reload commands across shards.');

            logger.debug('Responding with error embed.');
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()

                        .setDescription(
                            `**${this.embedOptions.icons.error} Oops!**\n_Hmm.._ It seems I am unable to reload commands across shards.`
                        )
                        .setColor(this.embedOptions.colors.error)
                        .setFooter({ text: `Execution ID: ${executionId}` })
                ]
            });
        }

        const commands: string[] | undefined = client!.commands?.map((command: BaseSlashCommandInteraction) => {
            let params: string = '';

            if (command.data.options && command.data.options.length > 1) {
                const options = command.data.options as unknown as ApplicationCommandOptionData[];

                options.map((option: ApplicationCommandOption) => {
                    params += `**\`${option.name}\`**` + ' ';
                });
            }

            return `- **\`/${command.data.name}\`** ${params}- ${command.data.description}`;
        });

        const embedDescription: string =
            `**${this.embedOptions.icons.bot} Reloaded commands**\n` + commands?.join('\n');

        logger.debug('Responding with success embed.');
        return await interaction.editReply({
            embeds: [new EmbedBuilder().setDescription(embedDescription).setColor(this.embedOptions.colors.success)]
        });
    }
}

export default new ReloadCommand();
