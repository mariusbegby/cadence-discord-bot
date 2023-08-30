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
import { EmbedOptions } from './configTypes';

interface BaseInteractionParams {
    executionId: string;
}

export interface BaseSlashCommandParams extends BaseInteractionParams {
    interaction: ChatInputCommandInteraction;
    client?: ExtendedClient;
}

interface BaseAutocompleteParams {
    interaction: AutocompleteInteraction;
}

interface BaseComponentParams {
    interaction: MessageComponentInteraction;
    referenceId?: string;
}

// Interaction types
export interface BaseSlashCommandInteraction {
    isNew: boolean;
    isBeta: boolean;
    isSystemCommand?: boolean;
    data: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
    execute(params: BaseSlashCommandParams): Promise<Message<boolean> | void>;
}

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
    protected getLoggerBase(
        module: string,
        source: string,
        name: string,
        executionId: string,
        interaction: Interaction
    ): Logger {
        return loggerModule.child({
            source: source,
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

export abstract class BaseCommandInteraction extends BaseInteraction {
    data: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
    isSystemCommand: boolean;
    isNew: boolean;
    isBeta: boolean;
    embedOptions: EmbedOptions;

    constructor(
        data: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>,
        isSystemCommand?: boolean,
        isNew?: boolean,
        isBeta?: boolean
    ) {
        super();
        this.data = data;
        this.isSystemCommand = isSystemCommand || false;
        this.isNew = isNew || false;
        this.isBeta = isBeta || false;
        this.embedOptions = config.get('embedOptions');
    }

    protected getLogger(source: string, name: string, executionId: string, interaction: Interaction): Logger {
        return super.getLoggerBase('slashCommand', source, name, executionId, interaction);
    }

    abstract execute(params: BaseSlashCommandParams): Promise<Message<boolean> | void>;
}
