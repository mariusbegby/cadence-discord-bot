import { GuildQueue, Track, useQueue } from 'discord-player';
import { EmbedBuilder } from 'discord.js';
import { BaseComponentInteraction } from '../../classes/interactions';
import { BaseComponentParams, BaseComponentReturnType } from '../../types/interactionTypes';
import { checkQueueCurrentTrack, checkQueueExists } from '../../utils/validation/queueValidator';
import { checkInVoiceChannel, checkSameVoiceChannel } from '../../utils/validation/voiceChannelValidator';

class NowplayingSkipButton extends BaseComponentInteraction {
    constructor() {
        super('nowplaying-skip-button');
    }

    async execute(params: BaseComponentParams): BaseComponentReturnType {
        const { executionId, interaction, referenceId } = params;
        const logger = this.getLogger(this.name, executionId, interaction);

        const queue: GuildQueue = useQueue(interaction.guild!.id)!;

        await this.runValidators({ interaction, queue, executionId }, [
            checkInVoiceChannel,
            checkSameVoiceChannel,
            checkQueueExists,
            checkQueueCurrentTrack
        ]);

        if (!queue || (queue.tracks.data.length === 0 && !queue.currentTrack)) {
            logger.debug('Tried skipping track but there was no queue.');

            logger.debug('Responding with warning embed.');
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${this.embedOptions.icons.warning} Oops!**\nThere is nothing currently playing. First add some tracks with **\`/play\`**!`
                        )
                        .setColor(this.embedOptions.colors.warning)
                ],
                components: []
            });
        }

        if (queue.currentTrack!.id !== referenceId) {
            logger.debug('Tried skipping track but it is not the current track and therefore already skipped/removed.');

            logger.debug('Responding with warning embed.');
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${this.embedOptions.icons.warning} Oops!**\nThis track has already been skipped or is no longer playing.`
                        )
                        .setColor(this.embedOptions.colors.warning)
                ],
                components: []
            });
        }

        const skippedTrack: Track = queue.currentTrack!;
        let durationFormat =
            Number(skippedTrack.raw.duration) === 0 || skippedTrack.duration === '0:00'
                ? ''
                : `\`${skippedTrack.duration}\``;

        if (skippedTrack.raw.live) {
            durationFormat = `${this.embedOptions.icons.liveTrack} \`LIVE\``;
        }
        queue.node.skip();
        logger.debug('Skipped the track.');

        const loopModesFormatted: Map<number, string> = new Map([
            [0, 'disabled'],
            [1, 'track'],
            [2, 'queue'],
            [3, 'autoplay']
        ]);

        const loopModeUserString: string = loopModesFormatted.get(queue.repeatMode)!;

        const getRepeatModeMessage = (repeatMode: number): string => {
            const icon = repeatMode === 3 ? this.embedOptions.icons.autoplaying : this.embedOptions.icons.looping;
            return `**${icon} Looping**\nLoop mode is set to **\`${loopModeUserString}\`**. You can change it with **\`/loop\`**.`;
        };

        const repeatModeString: string = queue.repeatMode === 0 ? '' : getRepeatModeMessage(queue.repeatMode);

        logger.debug('Responding with success embed.');
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor(this.getEmbedUserAuthor(interaction))
                    .setDescription(
                        `**${this.embedOptions.icons.skipped} Skipped track**\n**${durationFormat} [${
                            skippedTrack.title
                        }](${skippedTrack.raw.url ?? skippedTrack.url})**` + `\n\n${repeatModeString}`
                    )
                    .setThumbnail(skippedTrack.thumbnail)
                    .setColor(this.embedOptions.colors.success)
            ],
            components: []
        });
    }
}

export default new NowplayingSkipButton();
