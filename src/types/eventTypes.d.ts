import { GuildQueuePlayerNode } from 'discord-player';
import { BaseGuildTextChannel, BaseInteraction } from 'discord.js';
import { ExtendedClient } from './clientTypes';

export type ClientEventArguments = unknown[];
export type ProcessEventArguments = unknown[];
export type PlayerEventArguments = unknown[];

export type ExtendedGuildQueuePlayerNode = {
    metadata:
        | undefined
        | {
              client: ExtendedClient;
              channel: BaseGuildTextChannel;
              interaction?: BaseInteraction
          };
} & GuildQueuePlayerNode<unknown>;
