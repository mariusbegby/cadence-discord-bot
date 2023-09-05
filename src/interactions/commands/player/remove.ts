import { GuildQueue, Track, useQueue } from 'discord-player';
import { EmbedBuilder, GuildMember, SlashCommandBuilder } from 'discord.js';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../../types/interactionTypes';
import { BaseSlashCommandInteraction } from '../../../classes/interactions';
import { checkQueueExists } from '../../../utils/validation/queueValidator';
import { checkSameVoiceChannel, checkInVoiceChannel } from '../../../utils/validation/voiceChannelValidator';

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

        this.validators = [
            (args) => checkInVoiceChannel(args),
            (args) => checkSameVoiceChannel(args),
            (args) => checkQueueExists(args)
        ];
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, interaction } = params;
        const logger = this.getLogger(this.name, executionId, interaction);

        const queue: GuildQueue = useQueue(interaction.guild!.id)!;

        await this.runValidators({ interaction, queue, executionId });

        const removeTrackNumber: number = interaction.options.getNumber('tracknumber')!;

        if (removeTrackNumber > queue.tracks.data.length) {
            logger.debug('Specified track number is higher than total tracks.');

            logger.debug('Responding with warning embed.');
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${this.embedOptions.icons.warning} Oops!**\nTrack **\`${removeTrackNumber}\`** is not a valid track number. There are a total of **\`${queue.tracks.data.length}\`** tracks in the queue.\n\nView tracks added to the queue with **\`/queue\`**.`
                        )
                        .setColor(this.embedOptions.colors.warning)
                ]
            });
        }

        // Remove specified track number from queue
        const removedTrack: Track = queue.node.remove(removeTrackNumber - 1)!;
        logger.debug(`Removed track '${removedTrack.url}' from queue.`);
        let durationFormat =
            Number(removedTrack.raw.duration) === 0 || removedTrack.duration === '0:00'
                ? ''
                : `\`${removedTrack.duration}\``;

        if (removedTrack.raw.live) {
            durationFormat = `${this.embedOptions.icons.liveTrack} \`LIVE\``;
        }

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
                        `**${this.embedOptions.icons.success} Removed track**\n**${durationFormat} [${
                            removedTrack.title
                        }](${removedTrack.raw.url ?? removedTrack.url})**`
                    )
                    .setThumbnail(removedTrack.thumbnail)
                    .setColor(this.embedOptions.colors.success)
            ]
        });
    }
}

export default new RemoveCommand();
