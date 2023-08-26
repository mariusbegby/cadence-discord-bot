import { Player } from 'discord-player';
import { ExtendedClient } from './clientTypes';
import { ChatInputCommandInteraction } from 'discord.js';
import { GuildQueue } from 'discord-player';

export interface RegisterEventListenersParams {
    client: ExtendedClient;
    player: Player;
    executionId: string;
}

export interface RegisterClientCommandsParams {
    client: ExtendedClient;
    executionId: string;
}

export interface NotInVoiceChannelParams {
    interaction: ChatInputCommandInteraction;
    executionId: string;
}

export interface NotInSameVoiceChannelParams {
    interaction: ChatInputCommandInteraction;
    queue: GuildQueue;
    executionId: string;
}

export interface NotValidGuildIdParams {
    interaction: ChatInputCommandInteraction;
    executionId: string;
}

export interface TransformQueryParams {
    query: string;
    executionId: string;
}

export interface QueueDoesNotExistParams {
    interaction: ChatInputCommandInteraction;
    queue: GuildQueue;
    executionId: string;
}

export interface QueueNoCurrentTrackParams {
    interaction: ChatInputCommandInteraction;
    queue: GuildQueue;
    executionId: string;
}

export interface QueueIsEmptyParams {
    interaction: ChatInputCommandInteraction;
    queue: GuildQueue;
    executionId: string;
}

export interface CannotJoinVoiceOrTalkParams {
    interaction: ChatInputCommandInteraction;
    executionId: string;
}

export interface CannotSendMessageInChannelParams {
    interaction: ChatInputCommandInteraction;
    executionId: string;
}

export interface GetUptimeFormattedParams {
    executionId: string;
}

export interface StartLoadTestParams {
    client: ExtendedClient;
    executionId: string;
}

export interface PostBotStatsParams {
    client: ExtendedClient;
    executionId: string;
}

export interface PostBotStatsSite {
    enabled: boolean;
    hostname: string;
    path: string;
    method: string;
    body: object;
    token: string;
}
