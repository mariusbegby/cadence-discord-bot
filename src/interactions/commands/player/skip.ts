import { GuildQueue, Track, useQueue } from 'discord-player';
import { EmbedBuilder, GuildMember, SlashCommandBuilder } from 'discord.js';
import { BaseSlashCommandParams, BaseSlashCommandReturnType } from '../../../types/interactionTypes';
import { BaseSlashCommandInteraction } from '../../../classes/interactions';
import { checkQueueExists, checkQueueCurrentTrack } from '../../../utils/validation/queueValidator';
import { checkSameVoiceChannel, checkInVoiceChannel } from '../../../utils/validation/voiceChannelValidator';

class SkipCommand extends BaseSlashCommandInteraction {
    constructor() {
        const data = new SlashCommandBuilder()
            .setName('skip')
            .setDescription('Skip track to next or specified position in queue.')
            .addNumberOption((option) =>
                option.setName('tracknumber').setDescription('The position in queue to skip to.').setMinValue(1)
            );
        super(data);

        this.validators = [
            (args) => checkInVoiceChannel(args),
            (args) => checkSameVoiceChannel(args),
            (args) => checkQueueExists(args),
            (args) => checkQueueCurrentTrack(args)
        ];
    }

    async execute(params: BaseSlashCommandParams): BaseSlashCommandReturnType {
        const { executionId, interaction } = params;
        const logger = this.getLogger(this.name, executionId, interaction);

        const queue: GuildQueue = useQueue(interaction.guild!.id)!;

        await this.runValidators({ interaction, queue, executionId });

        const skipToTrack: number = interaction.options.getNumber('tracknumber')!;

        if (skipToTrack) {
            if (skipToTrack > queue.tracks.data.length) {
                logger.debug('Specified track number was higher than total tracks.');

                logger.debug('Responding with warning embed.');
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(
                                `**${this.embedOptions.icons.warning} Oops!**\nThere are only **\`${queue.tracks.data.length}\`** tracks in the queue. You cannot skip to track **\`${skipToTrack}\`**.\n\nView tracks added to the queue with **\`/queue\`**.`
                            )
                            .setColor(this.embedOptions.colors.warning)
                    ]
                });
            } else {
                const skippedTrack: Track = queue.currentTrack!;
                logger.debug('Responding with warning embed.');

                let durationFormat =
                    Number(skippedTrack.raw.duration) === 0 || skippedTrack.duration === '0:00'
                        ? ''
                        : `\`${skippedTrack.duration}\``;

                if (skippedTrack.raw.live) {
                    durationFormat = `${this.embedOptions.icons.liveTrack} \`LIVE\``;
                }

                queue.node.skipTo(skipToTrack - 1);
                logger.debug('Skipped to specified track number.');

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
                                `**${this.embedOptions.icons.skipped} Skipped track**\n**${durationFormat} [${
                                    skippedTrack.title
                                }](${skippedTrack.raw.url ?? skippedTrack.url})**`
                            )
                            .setThumbnail(skippedTrack.thumbnail)
                            .setColor(this.embedOptions.colors.success)
                    ]
                });
            }
        } else {
            if (queue.tracks.data.length === 0 && !queue.currentTrack) {
                logger.debug('No tracks in queue and no current track.');

                logger.debug('Responding with warning embed.');
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(
                                `**${this.embedOptions.icons.warning} Oops!**\nThere is nothing currently playing. First add some tracks with **\`/play\`**!`
                            )
                            .setColor(this.embedOptions.colors.warning)
                    ]
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
            logger.debug('Skipped current track.');

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
                            `**${this.embedOptions.icons.skipped} Skipped track**\n**${durationFormat} [${
                                skippedTrack.title
                            }](${skippedTrack.raw.url ?? skippedTrack.url})**` + `\n\n${repeatModeString}`
                        )
                        .setThumbnail(skippedTrack.thumbnail)
                        .setColor(this.embedOptions.colors.success)
                ]
            });
        }
    }
}

export default new SkipCommand();
