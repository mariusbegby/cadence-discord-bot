import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { BaseSlashCommandInteraction } from '../../common/classes/interactions';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../types/interactionTypes';
import { localizeCommand, useServerTranslator } from '../../common/utils/localeUtil';
import guildDatabaseClient from '../../common/services/guildDatabaseClient';
import { Logger } from '../../common/services/logger';

class SettingsCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = localizeCommand(
            new SlashCommandBuilder()
                .setName('settings')
                .addSubcommand((subcommand) => subcommand.setName('view'))
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('bot-language')
                        .addStringOption((option) =>
                            option
                                .setName('language')
                                .setRequired(true)
                                .addChoices(
                                    { name: 'English', value: 'en-US' },
                                    { name: 'Spanish', value: 'es-ES' },
                                    { name: 'Norwegian', value: 'no' },
                                    { name: 'Romanian', value: 'ro' }
                                )
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('default-volume')
                        .addIntegerOption((option) =>
                            option.setName('percentage').setRequired(true).setMinValue(1).setMaxValue(100)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('default-search-engine')
                        .addStringOption((option) =>
                            option
                                .setName('provider')
                                .setRequired(true)
                                .addChoices(
                                    { name: 'YouTube', value: 'youtube' },
                                    { name: 'Spotify', value: 'spotify' }
                                )
                        )
                )
                .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        );
        super(data);
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, interaction } = params;
        const logger = this.getLogger(this.name, executionId, interaction);

        await interaction.deferReply();
        logger.debug('Interaction deferred.');

        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case 'view':
                await this.showSettings(logger, executionId, interaction);
                break;

            case 'bot-language':
                await this.handleBotLanguageChange(logger, executionId, interaction);
                break;
            case 'default-volume':
                await this.handleDefaultVolumeChange(logger, executionId, interaction);
                break;
            case 'defaul-search-engine':
                await this.handleDefaultSearchEngineChange(logger, executionId, interaction);
                break;
            default:
                await Promise.resolve();
                break;
        }
    }

    private async replyNotImplemented(
        logger: Logger,
        executionId: string,
        interaction: ChatInputCommandInteraction
    ): Promise<void> {
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(this.embedOptions.colors.error)
                    .setDescription(
                        `${this.embedOptions.icons.error} **Not yet available**\n\nThis command is not yet implemented and cannot be used.`
                    )
            ]
        });

        logger.debug('Not implemented message sent.');
    }

    private async showSettings(
        logger: Logger,
        executionId: string,
        interaction: ChatInputCommandInteraction
    ): Promise<void> {
        return await this.replyNotImplemented(logger, executionId, interaction);

        logger.debug('Fetching settings from database.');

        const translator = useServerTranslator(interaction);
        const guildId = interaction.guildId;

        try {
            const database = await guildDatabaseClient.getGuildConfig(guildId!, executionId, interaction);
            const settingsArray = [
                `> ・**${translator('commands.settings.metadata.options.bot-language.name')}**: ${database?.locale ?? 'English'}`,
                `> ・**${translator('commands.settings.metadata.options.default-volume.name')}**: ${database?.defaultVolume ?? 50}%`,
                `> ・**${translator('commands.settings.metadata.options.default-search-engine.name')}**: ${database?.defaultSearchEngine}`
            ];

            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(this.embedOptions.colors.success)
                        .setDescription(settingsArray.join('\n'))
                        .setFooter({
                            text: interaction.user.username,
                            iconURL: interaction.user.displayAvatarURL()
                        })
                ]
            });

            logger.debug('Settings shown.');
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error, 'Error fetching settings from database.');

                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder().setColor(this.embedOptions.colors.error).setDescription(
                            translator('commands.settings.botLanguageError', {
                                icon: this.embedOptions.icons.error
                            }) +
                                '\n\n' +
                                '**Not implemented**\nThis command is not yet available.'
                        )
                    ]
                });
            }
        }
    }

    private async handleBotLanguageChange(
        logger: Logger,
        executionId: string,
        interaction: ChatInputCommandInteraction
    ): Promise<void> {
        return await this.replyNotImplemented(logger, executionId, interaction);

        const language = interaction.options.getString('language')!;
        const translator = useServerTranslator(interaction);
        const guildId = interaction.guildId;

        try {
            await guildDatabaseClient.createOrUpdateGuildConfig(
                executionId,
                guildId!,
                { locale: language },
                interaction
            );

            await interaction.editReply({
                embeds: [
                    new EmbedBuilder().setColor(this.embedOptions.colors.success).setDescription(
                        translator('commands.settings.botLanguageChanged', {
                            icon: this.embedOptions.icons.success,
                            language: language
                        })
                    )
                ]
            });
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error, 'Error setting bot language.');

                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder().setColor(this.embedOptions.colors.error).setDescription(
                            translator('commands.settings.botLanguageError', {
                                icon: this.embedOptions.icons.error
                            })
                        )
                    ]
                });
            }
        }
    }

    private async handleDefaultVolumeChange(
        logger: Logger,
        executionId: string,
        interaction: ChatInputCommandInteraction
    ): Promise<void> {
        return await this.replyNotImplemented(logger, executionId, interaction);

        const volume = interaction.options.getInteger('percentage')!;
        const translator = useServerTranslator(interaction);
        const guildId = interaction.guildId;

        try {
            await guildDatabaseClient.createOrUpdateGuildConfig(
                executionId,
                guildId!,
                { defaultVolume: volume },
                interaction
            );

            await interaction.editReply({
                embeds: [
                    new EmbedBuilder().setColor(this.embedOptions.colors.success).setDescription(
                        translator('commands.settings.defaultVolumeChanged', {
                            icon: this.embedOptions.icons.success,
                            volume: volume
                        })
                    )
                ]
            });
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error, 'Error setting default volume.');

                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder().setColor(this.embedOptions.colors.error).setDescription(
                            translator('commands.settings.defaultVolumeError', {
                                icon: this.embedOptions.icons.error
                            })
                        )
                    ]
                });
            }
        }
    }

    private async handleDefaultSearchEngineChange(
        logger: Logger,
        executionId: string,
        interaction: ChatInputCommandInteraction
    ): Promise<void> {
        return await this.replyNotImplemented(logger, executionId, interaction);

        const engine = interaction.options.getString('provider')!;
        const translator = useServerTranslator(interaction);
        const guildId = interaction.guildId;

        try {
            await guildDatabaseClient.createOrUpdateGuildConfig(
                executionId,
                guildId!,
                { defaultSearchEngine: engine },
                interaction
            );

            await interaction.editReply({
                embeds: [
                    new EmbedBuilder().setColor(this.embedOptions.colors.success).setDescription(
                        translator('commands.settings.defaultSearchEngineChanged', {
                            icon: this.embedOptions.icons.success,
                            provider: engine
                        })
                    )
                ]
            });
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error, 'Error setting default search engine.');

                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder().setColor(this.embedOptions.colors.error).setDescription(
                            translator('commands.settings.defaultSearchEngineError', {
                                icon: this.embedOptions.icons.error
                            })
                        )
                    ]
                });
            }
        }
    }
}

export default new SettingsCommand();
