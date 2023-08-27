import { GuildQueuePlayerNode } from 'discord-player';
import { ExtendedClient } from './clientTypes';
import { BaseGuildTextChannel } from 'discord.js';

export type ClientEventArguments = unknown[];
export type ProcessEventArguments = unknown[];
export type PlayerEventArguments = unknown[];

export interface ExtendedGuildQueuePlayerNode extends GuildQueuePlayerNode<unknown> {
    metadata:
        | undefined
        | {
              client: ExtendedClient;
              channel: BaseGuildTextChannel;
          };
}
