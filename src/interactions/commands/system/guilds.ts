import { EmbedBuilder, Guild, SlashCommandBuilder } from 'discord.js';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../../types/interactionTypes';
import { BaseSlashCommandInteraction } from '../../../classes/interactions';
import { notValidGuildId } from '../../../utils/validation/systemCommandValidator';

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

        if (await notValidGuildId({ interaction, executionId })) {
            return;
        }

        let shardGuilds: Guild[] = [];
        let totalGuildCount: number = 0;

        logger.debug('Fetching guilds from all shards.');
        await client!
            .shard!.broadcastEval((c) => {
                return c.guilds.cache.map((guild) => {
                    return guild;
                });
            })
            .then((guilds) => {
                shardGuilds = guilds.flat(1) as Guild[];
            });

        totalGuildCount = shardGuilds.length;

        logger.debug(`Successfully fetched ${totalGuildCount} guilds.`);

        const guildListFormatted: string = shardGuilds
            .map((guild) => {
                return {
                    name: guild.name,
                    memberCount: guild.memberCount
                };
            })
            .sort((a, b) => b.memberCount - a.memberCount)
            .slice(0, 25)
            .map((guild, index) => `${index + 1}. \`${guild.name} (#${guild.memberCount})\``)
            .join('\n');

        const totalMemberCount: number = shardGuilds.reduce((a, b) => a + b.memberCount, 0);

        let embedDescription =
            `**${this.embedOptions.icons.bot} ${
                totalGuildCount < 25 ? `Top ${totalGuildCount} guilds` : 'Top 25 guilds'
            } by member count (${totalGuildCount} total)**\n${guildListFormatted}` +
            `\n\n**Total members:** **\`${totalMemberCount}\`**`;

        logger.debug('Transformed guild into into embed description.');

        if (embedDescription.length >= 4000) {
            logger.debug('Embed description is too long, truncating.');
            embedDescription = `${embedDescription.slice(0, 3996)}...`;
        }

        logger.debug('Responding with info embed.');
        return await interaction.editReply({
            embeds: [new EmbedBuilder().setDescription(embedDescription).setColor(this.embedOptions.colors.info)]
        });
    }
}

export default new GuildsCommand();
