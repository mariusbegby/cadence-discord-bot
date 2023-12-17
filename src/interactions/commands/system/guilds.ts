import { EmbedBuilder, Guild, SlashCommandBuilder } from 'discord.js';
import { Logger } from 'pino';
import { BaseSlashCommandInteraction } from '../../../classes/interactions';
import { ExtendedClient } from '../../../types/clientTypes';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../../types/interactionTypes';
import { checkValidGuildId } from '../../../utils/validation/systemCommandValidator';
import { localizeCommand, useServerTranslator } from '../../../common/localeUtil';
import { TFunction } from 'i18next';

class GuildsCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = localizeCommand(new SlashCommandBuilder().setName('guilds'));
        const isSystemCommand: boolean = true;
        super(data, isSystemCommand);
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, interaction, client } = params;
        const logger = this.getLogger(this.name, executionId, interaction);
        const translator = useServerTranslator(interaction);

        await this.runValidators({ interaction, executionId }, [checkValidGuildId]);

        const shardGuilds = await this.fetchShardGuilds(client!, logger);
        const totalGuildCount = shardGuilds.length;

        logger.debug(`Successfully fetched ${totalGuildCount} guilds.`);

        const guildListFormatted = this.formatGuildListAsString(shardGuilds);
        const totalMemberCount = this.calculateTotalMemberCount(shardGuilds);

        let embedDescription = this.buildEmbedDescription(
            totalGuildCount,
            guildListFormatted,
            totalMemberCount,
            translator
        );

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
        totalMemberCount: number,
        translator: TFunction
    ): string {
        const guildCount = Math.max(totalGuildCount, 25);
        return (
            translator('commands.guilds.topGuildsByMemberCount', {
                icon: this.embedOptions.icons.bot,
                count: guildCount,
                totalCount: totalGuildCount
            }) +
            '\n' +
            guildListFormattedString +
            '\n' +
            '\n' +
            translator('commands.guilds.totalMembers', {
                count: totalMemberCount
            })
        );
    }
}

export default new GuildsCommand();
