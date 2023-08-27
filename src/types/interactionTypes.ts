import { MessageComponentInteraction } from 'discord.js';

export interface ComponentInteractionParams {
    interaction: MessageComponentInteraction;
    trackId?: string;
    executionId: string;
}
