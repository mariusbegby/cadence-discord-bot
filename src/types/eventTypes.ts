import { GuildQueuePlayerNode } from 'discord-player';
import { BaseGuildTextChannel } from 'discord.js';

import { ExtendedClient } from './clientTypes';

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
