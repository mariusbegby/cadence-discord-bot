import config from 'config';
import {
    ApplicationCommandOptionChoiceData,
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    Interaction,
    Message,
    MessageComponentInteraction,
    SlashCommandBuilder,
    SlashCommandSubcommandsOnlyBuilder
} from 'discord.js';
import { Logger } from 'pino';
import loggerModule from '../services/logger';
import { BotOptions, EmbedOptions } from '../types/configTypes';
import {
    BaseAutocompleteParams,
    BaseAutocompleteReturnType,
    BaseComponentParams,
    BaseComponentReturnType,
    BaseInteractionParams,
    BaseSlashCommandParams,
    BaseSlashCommandReturnType
} from '../types/interactionTypes';

abstract class BaseInteraction {
    protected getLoggerBase(
        module: string,
        name: string,
        executionId: string,
        interaction: Interaction | MessageComponentInteraction
    ): Logger {
        return loggerModule.child({
            module: module,
            name: name,
            executionId: executionId,
            shardId: interaction.guild?.shardId,
            guildId: interaction.guild?.id
        });
    }

    abstract execute(
        params: BaseInteractionParams
    ): Promise<Message<boolean> | ApplicationCommandOptionChoiceData | void>;
}

export abstract class BaseSlashCommandInteraction extends BaseInteraction {
    data: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'> | SlashCommandSubcommandsOnlyBuilder;
    isSystemCommand: boolean;
    isNew: boolean;
    isBeta: boolean;
    embedOptions: EmbedOptions;
    botOptions: BotOptions;
    name: string;

    constructor(
        data: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'> | SlashCommandSubcommandsOnlyBuilder,
        isSystemCommand: boolean = false,
        isNew: boolean = false,
        isBeta: boolean = false
    ) {
        super();
        this.data = data.setDMPermission(false).setNSFW(false);
        this.isSystemCommand = isSystemCommand;
        this.isNew = isNew;
        this.isBeta = isBeta;
        this.embedOptions = config.get('embedOptions');
        this.botOptions = config.get('botOptions');
        this.name = data.name;
    }

    protected getLogger(name: string, executionId: string, interaction: ChatInputCommandInteraction): Logger {
        return super.getLoggerBase('slashCommandInteraction', name, executionId, interaction);
    }

    abstract execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType;
}

export abstract class BaseAutocompleteInteraction extends BaseInteraction {
    name: string;

    constructor(name: string) {
        super();
        this.name = name;
    }

    protected getLogger(name: string, executionId: string, interaction: AutocompleteInteraction): Logger {
        return super.getLoggerBase('autocompleteInteraction', name, executionId, interaction);
    }

    abstract execute(params: BaseAutocompleteParams): BaseAutocompleteReturnType;
}

export abstract class BaseComponentInteraction extends BaseInteraction {
    embedOptions: EmbedOptions;
    botOptions: BotOptions;
    name: string;

    constructor(name: string) {
        super();
        this.embedOptions = config.get('embedOptions');
        this.botOptions = config.get('botOptions');
        this.name = name;
    }

    protected getLogger(name: string, executionId: string, interaction: MessageComponentInteraction): Logger {
        return super.getLoggerBase('componentInteraction', name, executionId, interaction);
    }

    abstract execute(params: BaseComponentParams): BaseComponentReturnType;
}

export class CustomError extends Error {
    type?: string;
    code?: string;
}
