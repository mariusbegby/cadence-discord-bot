import config from 'config';
import {
    ApplicationCommandOptionChoiceData,
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    Interaction,
    Message,
    MessageComponentInteraction,
    SlashCommandBuilder
} from 'discord.js';
import { Logger } from 'pino';
import loggerModule from '../services/logger';
import { ExtendedClient } from './clientTypes';
import { BotOptions, EmbedOptions } from './configTypes';

interface BaseInteractionParams {
    executionId: string;
}

export interface BaseSlashCommandParams extends BaseInteractionParams {
    interaction: ChatInputCommandInteraction;
    client?: ExtendedClient;
}

export type BaseSlashCommandReturnType = Promise<Message<boolean> | void>;

interface BaseAutocompleteParams extends BaseInteractionParams {
    interaction: AutocompleteInteraction;
}

interface BaseComponentParams extends BaseInteractionParams {
    interaction: MessageComponentInteraction;
    referenceId?: string;
}

// Interaction types

export interface BaseAutocompleteInteraction {
    execute(params: BaseAutocompleteParams): Promise<ApplicationCommandOptionChoiceData | void>;
}

export interface BaseComponentInteraction {
    execute(params: BaseComponentParams): Promise<Message<boolean> | void>;
}

export interface ShardInfo {
    shardId: number;
    memUsage: number;
    guildCount: number;
    guildMemberCount: number;
    playerStatistics: {
        activeVoiceConnections: number;
        totalTracks: number;
        totalListeners: number;
    };
}

export interface TrackMetadata {
    bridge: {
        views: number;
    };
}

export class CustomError extends Error {
    type?: string;
    code?: string;
}

abstract class BaseInteraction {
    protected getLoggerBase(module: string, source: string, executionId: string, interaction: Interaction): Logger {
        return loggerModule.child({
            source: source,
            module: module,
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
    data: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
    isSystemCommand: boolean;
    isNew: boolean;
    isBeta: boolean;
    embedOptions: EmbedOptions;
    botOptions: BotOptions;
    commandName: string;

    constructor(
        data: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>,
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
        this.commandName = data.name;
    }

    protected getLogger(source: string, executionId: string, interaction: Interaction): Logger {
        return super.getLoggerBase('slashCommand', source, executionId, interaction);
    }

    abstract execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType;
}
