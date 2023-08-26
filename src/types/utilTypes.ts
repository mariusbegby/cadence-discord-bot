import { Player } from 'discord-player';
import { ExtendedClient } from './clientTypes';

export interface RegisterEventListenersParams {
    client: ExtendedClient;
    player: Player;
    executionId: string;
}

export interface RegisterClientCommandsParams {
    client: ExtendedClient;
    executionId: string;
}
