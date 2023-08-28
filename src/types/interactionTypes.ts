import {
    ApplicationCommandOptionChoiceData,
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    Message,
    MessageComponentInteraction,
    SlashCommandBuilder
} from 'discord.js';
import { ExtendedClient } from './clientTypes';

// Local types
interface CommandParams {
    client?: ExtendedClient;
    executionId: string;
    interaction: ChatInputCommandInteraction;
}

interface AutocompleteParams {
    executionId: string;
    interaction: AutocompleteInteraction;
}

interface ComponentParams {
    interaction: MessageComponentInteraction;
    referenceId?: string;
    executionId: string;
}

// Interaction types
export interface CustomSlashCommandInteraction {
    isNew: boolean;
    isBeta: boolean;
    isSystemCommand?: boolean;
    data: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
    execute(params: CommandParams): Promise<Message<boolean> | void>;
}

export interface CustomAutocompleteInteraction {
    execute(params: AutocompleteParams): Promise<ApplicationCommandOptionChoiceData | void>;
}

export interface CustomComponentInteraction {
    execute(params: ComponentParams): Promise<Message<boolean> | void>;
}

// Command specific types
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
