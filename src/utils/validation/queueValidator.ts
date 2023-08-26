import config from 'config';
import { EmbedOptions } from '../../types/configTypes';
const embedOptions: EmbedOptions = config.get('embedOptions');
import { EmbedBuilder } from 'discord.js';
import loggerModule from '../../services/logger';

export const queueDoesNotExist = async ({ interaction, queue, executionId }) => {
    const logger = loggerModule.child({
        source: 'queueValidator.js',
        module: 'utilValidation',
        name: 'queueDoesNotExist',
        executionId: executionId,
        shardId: interaction.guild.shardId,
        guildId: interaction.guild.id
    });

    if (!queue) {
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${embedOptions.icons.warning} Oops!**\nThere are no tracks in the queue and nothing currently playing. First add some tracks with **\`/play\`**!`
                    )
                    .setColor(embedOptions.colors.warning)
            ]
        });

        logger.debug(`User tried to use command '${interaction.commandName}' but there was no queue.`);
        return true;
    }

    return false;
};

export const queueNoCurrentTrack = async ({ interaction, queue, executionId }) => {
    const logger = loggerModule.child({
        source: 'queueValidator.js',
        module: 'utilValidation',
        name: 'queueNoCurrentTrack',
        executionId: executionId,
        shardId: interaction.guild.shardId,
        guildId: interaction.guild.id
    });

    if (!queue.currentTrack) {
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${embedOptions.icons.warning} Oops!**\nThere is nothing currently playing. First add some tracks with **\`/play\`**!`
                    )
                    .setColor(embedOptions.colors.warning)
            ]
        });

        logger.debug(`User tried to use command '${interaction.commandName}' but there was no current track.`);
        return true;
    }

    return false;
};

export const queueIsEmpty = async ({ interaction, queue, executionId }) => {
    const logger = loggerModule.child({
        source: 'queueValidator.js',
        module: 'utilValidation',
        name: 'queueIsEmpty',
        executionId: executionId,
        shardId: interaction.guild.shardId,
        guildId: interaction.guild.id
    });

    if (queue.tracks.data.length === 0) {
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**${embedOptions.icons.warning} Oops!**\nThere are no tracks added to the queue. First add some tracks with **\`/play\`**!`
                    )
                    .setColor(embedOptions.colors.warning)
            ]
        });

        logger.debug(`User tried to use command '${interaction.commandName}' but there was no tracks in the queue.`);
        return true;
    }

    return false;
};
