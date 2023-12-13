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
            .setDescription('Remove tracks from the queue')
            .addSubcommand((subcommand) =>
                subcommand
                    .setName('track')
                    .setDescription('Remove a track from the queue')
                    .addIntegerOption((option) =>
                        option
                            .setName('position')
                            .setDescription('The position in queue for track to remove.')
                            .setMinValue(1)
                            .setRequired(true)
                    )
            )
            .addSubcommand((subcommand) =>
                subcommand
                    .setName('range')
                    .setDescription('Remove a range of tracks from the queue')
                    .addIntegerOption((option) =>
                        option
                            .setName('start')
                            .setDescription('The starting position of the range to remove')
                            .setRequired(true)
                    )
                    .addIntegerOption((option) =>
                        option
                            .setName('end')
                            .setDescription('The ending position of the range to remove')
                            .setRequired(true)
                    )
            )
            .addSubcommand((subcommand) =>
                subcommand.setName('queue').setDescription('Remove all tracks from the queue')
            )
            .addSubcommand((subcommand) =>
                subcommand.setName('duplicates').setDescription('Remove all duplicate tracks from the queue')
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

        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            default:
                return Promise.resolve();
        }

        const trackPositionInput: number = interaction.options.getNumber('position')!;

        if (trackPositionInput > queue.tracks.data.length) {
            return await this.handleTrackPositionHigherThanQueueLength(logger, interaction, trackPositionInput, queue);
        }

        return await this.removeTrackFromQueue(logger, interaction, queue, trackPositionInput);
    }

    private async handleTrackPositionHigherThanQueueLength(
        logger: Logger,
        interaction: ChatInputCommandInteraction,
        trackPositionInput: number,
        queue: GuildQueue
    ) {
        logger.debug('Specified track position is higher than total tracks.');

        logger.debug('Responding with warning embed.');
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${this.embedOptions.icons.warning} Oops!**\n` +
                            `Track **\`${trackPositionInput}\`** is not a valid track position. There are a total of **\`${queue.tracks.data.length}\`** tracks in the queue.` +
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
        trackPositionInput: number
    ) {
        const removedTrack: Track = queue.node.remove(trackPositionInput - 1)!;
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
