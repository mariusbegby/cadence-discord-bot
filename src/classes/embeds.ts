import config from 'config';
import {
    ChatInputCommandInteraction,
    EmbedAuthorData,
    EmbedBuilder,
    EmbedFooterData,
    InteractionResponse,
    Message,
    MessageComponentInteraction,
    EmbedField
} from 'discord.js';
import { EmbedOptions } from '../types/configTypes';

export type EmbedContext = {
    author?: EmbedAuthorData;
    title?: string;
    description: string;
    footer?: EmbedFooterData;
    thumbnail?: string;
    fields?: EmbedField[];
};

abstract class BaseEmbed {
    embedOptions: EmbedOptions;
    context: EmbedContext;
    interaction: ChatInputCommandInteraction | MessageComponentInteraction;
    embed: EmbedBuilder;

    constructor(interaction: ChatInputCommandInteraction | MessageComponentInteraction, context: EmbedContext) {
        this.embedOptions = config.get('embedOptions');
        this.context = context;
        this.interaction = interaction;
        this.embed = new EmbedBuilder();
        this.embed.setDescription(`${context.title ? `**${context.title}**\n` : ''}${context.description}`);
        context.author && this.embed.setAuthor(context.author);
        context.footer && this.embed.setFooter(context.footer);
        context.thumbnail && this.embed.setThumbnail(context.thumbnail);
    }

    abstract send(): Promise<Message<boolean> | InteractionResponse<boolean>>;
}

export class InfoEmbed extends BaseEmbed {
    constructor(interaction: ChatInputCommandInteraction | MessageComponentInteraction, context: EmbedContext) {
        super(interaction, context);

        this.embed.setColor(this.embedOptions.colors.info);
    }

    async send(): Promise<Message<boolean>> {
        const embeds = { embeds: [this.embed] };
        return await this.interaction.editReply(embeds);
    }
}
