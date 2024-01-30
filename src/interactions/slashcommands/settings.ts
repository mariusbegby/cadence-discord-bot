import { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction } from 'discord.js';
import { BaseSlashCommandInteraction } from '../../common/classes/interactions';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../types/interactionTypes';
import { localizeCommand, useServerTranslator } from '../../common/utils/localeUtil';
import { Logger } from 'pino';
import { TFunction } from 'i18next';
import guildDatabaseClient from '../../common/services/guildDatabaseClient';

class SettingsCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = localizeCommand(
            new SlashCommandBuilder()
                .setName('settings')
                .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
                .addSubcommand((subcommand) => subcommand.setName('view'))
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('bot-language')
                        .addStringOption((option) =>
                            option
                                .setName('language')
                                .addChoices(
                                    { value: 'en-US', name: ' ' },
                                    { value: 'no', name: ' ' },
                                    { value: 'ro', name: ' ' },
                                    { value: 'en-ES', name: ' ' }
                                )
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('default-volume')
                        .addIntegerOption((option) => option.setName('percentage').setMinValue(0).setMaxValue(100))
                )
                .addSubcommand((subcommand) => subcommand.setName('action-permissions'))
        );
        super(data);
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, interaction } = params;
        const logger = this.getLogger(this.name, executionId, interaction);
        const translator = useServerTranslator(interaction);

        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case 'view':
                return await this.handleShowSettings(executionId, logger, interaction, translator);
            case 'default-volume':
                return await this.handleDefaultVolume(executionId, logger, interaction, translator);
            default:
                return Promise.resolve();
        }
    }

    private async handleShowSettings(
        executionId: string,
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        translator: TFunction
    ) {
        logger.debug('Showing settings');

        // get settings from database
        const settings = await guildDatabaseClient.getGuildConfig(interaction.guild!.id, executionId, interaction);

        console.log(settings);

        if (!settings) {
            logger.debug('No settings found');
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`Could not find settings for guild id ${interaction.guild!.id}`)
                        .setColor(this.embedOptions.colors.warning)
                ]
            });
        }

        const settingsAsString = [
            `Language: ${settings.locale}`,
            `Volume: ${settings.defaultVolume}`,
            `Action permissions: ${Object.keys(settings.actionPermissions).join(', ')}`
        ].join('\n');

        return await interaction.editReply({
            embeds: [new EmbedBuilder().setDescription(settingsAsString).setColor(this.embedOptions.colors.info)]
        });
    }

    private async handleDefaultVolume(
        executionId: string,
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        translator: TFunction
    ) {
        logger.debug('Setting volume');

        const volume = interaction.options.getInteger('percentage');

        const settings = await guildDatabaseClient.getGuildConfig(interaction.guild!.id, executionId, interaction);

        if (!volume) {
            if (!settings) {
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(`Could not find settings for guild id ${interaction.guild!.id}`)
                            .setColor(this.embedOptions.colors.warning)
                    ]
                });
            }

            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`Current default volume is ${settings.defaultVolume}`)
                        .setColor(this.embedOptions.colors.info)
                ]
            });
        }

        if (volume < 0 || volume > 100) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription('Volume must be between 0 and 100')
                        .setColor(this.embedOptions.colors.error)
                ]
            });
        }

        const updatedSettings = {
            ...settings,
            defaultVolume: volume
        };

        await guildDatabaseClient.createOrUpdateGuildConfig(
            executionId,
            interaction.guild!.id,
            updatedSettings,
            interaction
        );

        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Default volume set to ${volume}`)
                    .setColor(this.embedOptions.colors.success)
            ]
        });
    }
}

export default new SettingsCommand();
