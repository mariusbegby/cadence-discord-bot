import { GuildQueue, Track, useQueue } from 'discord-player';
import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { BaseSlashCommandInteraction } from '../../../classes/interactions';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../../types/interactionTypes';
import { checkQueueExists } from '../../../utils/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../../utils/validation/voiceChannelValidator';
import { Logger } from 'pino';

class RemoveCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = new SlashCommandBuilder()
            .setName('remove')
            .setDescription('Remove specified track from the queue')
            .addNumberOption((option) =>
                option
                    .setName('tracknumber')
                    .setDescription('The position in queue for track to remove.')
                    .setMinValue(1)
                    .setRequired(true)
            );
        super(data);
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, interaction } = params;
        const logger = this.getLogger(this.name, executionId, interaction);

        const queue: GuildQueue = useQueue(interaction.guild!.id)!;

        await this.runValidators({ interaction, queue, executionId }, [
            checkInVoiceChannel,
            checkSameVoiceChannel,
            checkQueueExists
        ]);

        const removeTrackNumber: number = interaction.options.getNumber('tracknumber')!;

        if (removeTrackNumber > queue.tracks.data.length) {
            return await this.handleInvalidTrackNumber(logger, interaction, removeTrackNumber, queue);
        }

        return await this.removeTrackFromQueue(logger, interaction, queue, removeTrackNumber);
    }

    private async handleInvalidTrackNumber(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        removeTrackNumber: number,
        queue: GuildQueue
    ) {
        logger.debug('Specified track number is higher than total tracks.');

        logger.debug('Responding with warning embed.');
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${this.embedOptions.icons.warning} Oops!**\n` +
                            `Track **\`${removeTrackNumber}\`** is not a valid track number. There are a total of **\`${queue.tracks.data.length}\`** tracks in the queue.` +
                            '\n\nView tracks added to the queue with **`/queue`**.'
                    )
                    .setColor(this.embedOptions.colors.warning)
            ]
        });
        return Promise.resolve();
    }

    private async removeTrackFromQueue(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        queue: GuildQueue,
        removeTrackNumber: number
    ) {
        const removedTrack: Track = queue.node.remove(removeTrackNumber - 1)!;
        logger.debug(`Removed track '${removedTrack.url}' from queue.`);

        logger.debug('Responding with success embed.');
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(this.getEmbedUserAuthor(interaction))
                    .setDescription(
                        `**${this.embedOptions.icons.success} Removed track**\n${this.getDisplayTrackDurationAndUrl(
                            removedTrack
                        )}`
                    )
                    .setThumbnail(this.getTrackThumbnailUrl(removedTrack))
                    .setColor(this.embedOptions.colors.success)
            ]
        });
        return Promise.resolve();
    }
}

export default new RemoveCommand();
