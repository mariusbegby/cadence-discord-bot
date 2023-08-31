import { GuildQueue, Player } from 'discord-player';
import { ChatInputCommandInteraction, MessageComponentInteraction } from 'discord.js';

import { ExtendedClient } from './clientTypes';

export interface RegisterEventListenersParams {
    client: ExtendedClient;
    player: Player;
    executionId: string;
}

export interface RegisterClientInteractionsParams {
    client: ExtendedClient;
    executionId: string;
}

export interface CustomEvent {
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    execute: (...args: any) => void;
    once?: boolean;
    isDebug?: boolean;
    isPlayerEvent?: boolean;
}

export interface NotInVoiceChannelParams {
    interaction: ChatInputCommandInteraction | MessageComponentInteraction;
    executionId: string;
}

export interface NotInSameVoiceChannelParams {
    interaction: ChatInputCommandInteraction | MessageComponentInteraction;
    queue: GuildQueue;
    executionId: string;
}

export interface NotValidGuildIdParams {
    interaction: ChatInputCommandInteraction | MessageComponentInteraction;
    executionId: string;
}

export interface TransformQueryParams {
    query: string;
    executionId: string;
}

export interface QueueDoesNotExistParams {
    interaction: ChatInputCommandInteraction | MessageComponentInteraction;
    queue: GuildQueue;
    executionId: string;
}

export interface QueueNoCurrentTrackParams {
    interaction: ChatInputCommandInteraction | MessageComponentInteraction;
    queue: GuildQueue;
    executionId: string;
}

export interface QueueIsEmptyParams {
    interaction: ChatInputCommandInteraction | MessageComponentInteraction;
    queue: GuildQueue;
    executionId: string;
}

export interface CannotJoinVoiceOrTalkParams {
    interaction: ChatInputCommandInteraction | MessageComponentInteraction;
    executionId: string;
}

export interface CannotSendMessageInChannelParams {
    interaction: ChatInputCommandInteraction | MessageComponentInteraction;
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
