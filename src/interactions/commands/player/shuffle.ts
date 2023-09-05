import { GuildQueue, useQueue } from 'discord-player';
import { EmbedBuilder, GuildMember, SlashCommandBuilder } from 'discord.js';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../../types/interactionTypes';
import { BaseSlashCommandInteraction } from '../../../classes/interactions';
import { checkQueueExists, checkQueueEmpty } from '../../../utils/validation/queueValidator';
import { checkSameVoiceChannel, checkInVoiceChannel } from '../../../utils/validation/voiceChannelValidator';

class ShuffleCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = new SlashCommandBuilder()
            .setName('shuffle')
            .setDescription('Randomly shuffle all tracks in the queue.');
        super(data);

        this.validators = [
            (args) => checkInVoiceChannel(args),
            (args) => checkSameVoiceChannel(args),
            (args) => checkQueueExists(args),
            (args) => checkQueueEmpty(args)
        ];
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, interaction } = params;
        const logger = this.getLogger(this.name, executionId, interaction);

        const queue: GuildQueue = useQueue(interaction.guild!.id)!;

        await this.runValidators({ interaction, queue, executionId });

        queue.tracks.shuffle();
        logger.debug('Shuffled queue tracks.');

        let authorName: string;

        if (interaction.member instanceof GuildMember) {
            authorName = interaction.member.nickname || interaction.user.username;
        } else {
            authorName = interaction.user.username;
        }

        logger.debug('Responding with success embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: authorName,
                        iconURL: interaction.user.avatarURL() || this.embedOptions.info.fallbackIconUrl
                    })
                    .setDescription(
                        `**${this.embedOptions.icons.shuffled} Shuffled queue tracks**\nThe **${queue.tracks.data.length}** tracks in the queue has been shuffled.\n\nView the new queue order with **\`/queue\`**.`
                    )
                    .setColor(this.embedOptions.colors.success)
            ]
        });
    }
}

export default new ShuffleCommand();
