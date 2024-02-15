import { QueueRepeatMode } from 'discord-player';
import { Translator } from './localeUtil';
import { EmbedOptions } from '../../types/configTypes';

export function formatDuration(durationMs: number): string {
    const durationDate: Date = new Date(0);
    durationDate.setMilliseconds(durationMs);

    const durationDays: number = durationDate.getUTCDate() - 1;
    const durationHours: number = durationDate.getUTCHours();
    const durationMinutes: number = durationDate.getUTCMinutes();
    const durationSeconds: number = durationDate.getUTCSeconds();

    if (durationDays >= 1) {
        return `${durationDays}d ${durationHours}h`;
    } else if (durationHours >= 1) {
        return `${durationHours}h ${durationMinutes}m`;
    } else if (durationMinutes >= 1) {
        return `${durationMinutes}m ${durationSeconds}s`;
    } else {
        return `${durationSeconds}s`;
    }
}

export function formatSlashCommand(commandName: string, translator: Translator): string {
    const translatedName = translator(`commands.${commandName}.metadata.name`, {
        defaultValue: commandName
    });
    return `**\`/${translatedName}\`**`;
}

export function formatRepeatMode(repeatMode: QueueRepeatMode, translator: Translator): string {
    switch (repeatMode) {
        case QueueRepeatMode.AUTOPLAY:
            return translator('musicPlayerCommon.queueRepeatMode.autoplay');
        case QueueRepeatMode.OFF:
            return translator('musicPlayerCommon.queueRepeatMode.off');
        case QueueRepeatMode.TRACK:
            return translator('musicPlayerCommon.queueRepeatMode.track');
        case QueueRepeatMode.QUEUE:
            return translator('musicPlayerCommon.queueRepeatMode.queue');
    }
}

export function formatRepeatModeDetailed(
    repeatMode: QueueRepeatMode,
    embedOptions: EmbedOptions,
    translator: Translator,
    state: string = 'info'
) {
    let icon: string;

    switch (repeatMode) {
        case QueueRepeatMode.TRACK:
            icon = state === 'info' ? embedOptions.icons.loop : embedOptions.icons.looping;
            break;
        case QueueRepeatMode.QUEUE:
            icon = state === 'info' ? embedOptions.icons.loop : embedOptions.icons.looping;
            break;
        case QueueRepeatMode.AUTOPLAY:
            icon = state === 'info' ? embedOptions.icons.autoplay : embedOptions.icons.autoplaying;
            break;
        default:
            return '';
    }

    return (
        '\n' +
        translator('musicPlayerCommon.loopingInfo', {
            icon,
            loopMode: formatRepeatMode(repeatMode, translator),
            loopCommand: formatSlashCommand('loop', translator)
        })
    );
}
