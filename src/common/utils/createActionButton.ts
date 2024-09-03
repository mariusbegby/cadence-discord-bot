import {
    type APIActionRowComponent,
    type APIButtonComponent,
    type APIButtonComponentWithCustomId,
    type APIMessageActionRowComponent,
    ButtonBuilder,
    ButtonStyle
} from 'discord.js';

export function createNewActionButton(
    customId: string,
    emoji: string,
    embedActionRow: APIActionRowComponent<APIMessageActionRowComponent> | null
): APIButtonComponent {
    const actionButton: APIButtonComponent = new ButtonBuilder()
        .setCustomId(customId)
        .setStyle(ButtonStyle.Secondary)
        .setEmoji(emoji)
        .toJSON() as APIButtonComponentWithCustomId;

    if (embedActionRow) {
        embedActionRow.components.push(actionButton);
    }

    return actionButton;
}
