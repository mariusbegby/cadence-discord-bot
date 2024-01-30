import {
    ApplicationCommandOption,
    ApplicationCommandOptionData,
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder
} from 'discord.js';
import { Logger } from 'pino';
import { BaseSlashCommandInteraction } from '../../common/classes/interactions';
import { ExtendedClient } from '../../types/clientTypes';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../types/interactionTypes';
import { checkValidGuildId } from '../../common/validation/systemCommandValidator';
import { localizeCommand, useServerTranslator } from '../../common/utils/localeUtil';
import { TFunction } from 'i18next';

class ReloadCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = localizeCommand(new SlashCommandBuilder().setName('reload'));
        const isSystemCommand: boolean = true;
        super(data, isSystemCommand);
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, interaction, client } = params;
        const logger = this.getLogger(this.name, executionId, interaction);
        const translator = useServerTranslator(interaction);

        await this.runValidators({ interaction, executionId }, [checkValidGuildId]);

        try {
            await this.reloadInteractionsAcrossShards(logger, executionId, client!);
        } catch (error) {
            return await this.handleReloadError(logger, interaction, executionId, error, translator);
        }

        return await this.respondWithSuccessEmbed(logger, interaction, client!, translator);
    }

    private async reloadInteractionsAcrossShards(logger: Logger, executionId: string, client: ExtendedClient) {
        logger.debug('Reloading interaction module across all shards.');
        await client!.shard!.broadcastEval(
            async (shardClient: ExtendedClient, { executionId }) => {
                shardClient.registerClientInteractions!({ client: shardClient, executionId });
            },
            { context: { executionId: executionId } }
        );
        logger.debug('Successfully reloaded interaction module across all shards.');
    }

    private async handleReloadError(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        executionId: string,
        error: Error | unknown,
        translator: TFunction
    ) {
        logger.error(error, 'Failed to reload interaction module across shards.');

        logger.debug('Responding with error embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        translator('commands.reload.unableToReload', {
                            icon: this.embedOptions.icons.error
                        })
                    )
                    .setColor(this.embedOptions.colors.error)
                    .setFooter({ text: `Execution ID: ${executionId}` })
            ]
        });
    }

    private async respondWithSuccessEmbed(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        client: ExtendedClient,
        translator: TFunction
    ) {
        const commands = this.getCommands(client);
        const embedDescription = this.buildEmbedDescription(commands, translator);

        logger.debug('Responding with success embed.');
        return await interaction.editReply({
            embeds: [new EmbedBuilder().setDescription(embedDescription).setColor(this.embedOptions.colors.success)]
        });
    }

    private getCommands(client: ExtendedClient): string[] | undefined {
        return client!.slashCommandInteractions?.map((command: BaseSlashCommandInteraction) => {
            const params = this.getCommandParams(command);
            return `- **\`/${command.data.name}\`** ${params}- ${command.data.description}`;
        });
    }

    private getCommandParams(command: BaseSlashCommandInteraction): string {
        let params: string = '';

        if (command.data.options && command.data.options.length > 1) {
            const options = command.data.options as unknown as ApplicationCommandOptionData[];

            options.map((option: ApplicationCommandOption) => {
                params += `**\`${option.name}\`**` + ' ';
            });
        }

        return params;
    }

    private buildEmbedDescription(commands: string[] | undefined, translator: TFunction): string {
        return (
            translator('commands.reload.reloadedCommands', {
                icon: this.embedOptions.icons.bot
            }) +
            '\n' +
            commands?.join('\n')
        );
    }
}

export default new ReloadCommand();
