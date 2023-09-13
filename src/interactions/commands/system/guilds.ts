import { EmbedBuilder, Guild, SlashCommandBuilder } from 'discord.js';
import { Logger } from 'pino';
import { BaseSlashCommandInteraction } from '../../../classes/interactions';
import { ExtendedClient } from '../../../types/clientTypes';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../../types/interactionTypes';
import { checkValidGuildId } from '../../../utils/validation/systemCommandValidator';

class GuildsCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = new SlashCommandBuilder()
            .setName('guilds')
            .setDescription('Show the top 25 guilds by member count.');
        const isSystemCommand: boolean = true;
        super(data, isSystemCommand);
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, interaction, client } = params;
        const logger = this.getLogger(this.name, executionId, interaction);

        await this.runValidators({ interaction, executionId }, [checkValidGuildId]);

        const shardGuilds = await this.fetchShardGuilds(client!, logger);
        const totalGuildCount = shardGuilds.length;

        logger.debug(`Successfully fetched ${totalGuildCount} guilds.`);

        const guildListFormatted = this.formatGuildListAsString(shardGuilds);
        const totalMemberCount = this.calculateTotalMemberCount(shardGuilds);

        let embedDescription = this.buildEmbedDescription(totalGuildCount, guildListFormatted, totalMemberCount);

        if (embedDescription.length >= 4000) {
            logger.debug('Embed description is too long, truncating.');
            embedDescription = `${embedDescription.slice(0, 3996)}...`;
        }

        logger.debug('Responding with info embed.');
        return await interaction.editReply({
            embeds: [new EmbedBuilder().setDescription(embedDescription).setColor(this.embedOptions.colors.info)]
        });
    }

    private async fetchShardGuilds(client: ExtendedClient, logger: Logger): Promise<Guild[]> {
        logger.debug('Fetching guilds from all shards.');
        const guilds = await client!.shard!.broadcastEval((c) => c.guilds.cache.map((guild) => guild));
        return guilds.flat(1) as Guild[];
    }

    private formatGuildListAsString(shardGuilds: Guild[]): string {
        const guilds = this.mapGuilds(shardGuilds);
        const topGuilds = this.getTopGuilds(guilds);
        return this.guildsToString(topGuilds);
    }

    private mapGuilds(shardGuilds: Guild[]) {
        return shardGuilds.map((guild) => ({ name: guild.name, memberCount: guild.memberCount }));
    }

    private getTopGuilds(guilds: { name: string; memberCount: number }[]) {
        return guilds.sort((a, b) => b.memberCount - a.memberCount).slice(0, 25);
    }

    private guildsToString(guilds: { name: string; memberCount: number }[]) {
        return guilds.map((guild, index) => `${index + 1}. \`${guild.name} (#${guild.memberCount})\``).join('\n');
    }

    private calculateTotalMemberCount(shardGuilds: Guild[]): number {
        return shardGuilds.reduce((a, b) => a + b.memberCount, 0);
    }

    private buildEmbedDescription(
        totalGuildCount: number,
        guildListFormattedString: string,
        totalMemberCount: number
    ): string {
        const topGuildsString = totalGuildCount < 25 ? `Top ${totalGuildCount} guilds` : 'Top 25 guilds';
        return (
            `**${this.embedOptions.icons.bot} ${topGuildsString} by member count (${totalGuildCount} total)**\n` +
            `${guildListFormattedString}\n\n` +
            `**Total members:** **\`${totalMemberCount}\`**`
        );
    }
}

export default new GuildsCommand();
