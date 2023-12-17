import assert from 'assert';
import {
    APIApplicationCommandOption,
    ApplicationCommandOptionType,
    BaseInteraction,
    Locale,
    SlashCommandBuilder
} from 'discord.js';
import { lstatSync, readdirSync } from 'fs';
import i18n from 'i18next';
import i18nextFsBackend, { FsBackendOptions } from 'i18next-fs-backend';
import { join } from 'path';

const translatorInstance = i18n.createInstance();
const localeDir = join(__dirname, '..', '..', 'locales');
translatorInstance.use(i18nextFsBackend).init<FsBackendOptions>({
    initImmediate: false,
    fallbackLng: 'en',
    preload: readdirSync(localeDir).filter((fileName) => {
        const joinedPath = join(localeDir, fileName);
        const isDirectory = lstatSync(joinedPath).isDirectory();
        return isDirectory;
    }),
    ns: 'bot',
    defaultNS: 'bot',
    backend: {
        loadPath: join(localeDir, '{{lng}}', '{{ns}}.json'),
        addPath: join(localeDir, '{{lng}}', '{{ns}}.missing.json')
    },
    interpolation: {
        escapeValue: false
    }
});

export function useServerTranslator(interaction: BaseInteraction) {
    return translatorInstance.getFixedT(interaction.guildLocale ?? 'en');
}

export function useUserTranslator(interaction: BaseInteraction) {
    return translatorInstance.getFixedT(interaction.locale ?? 'en');
}

export const DISCORD_LOCALES = Object.values(Locale);

export type CommandMetadata = {
    name?: string;
    description?: string;
    options?: Record<
        string,
        {
            name?: string;
            description?: string;
            choices?: Record<string, string>;
        }
    >;
};

type DeepMutable<T> = { -readonly [P in keyof T]: DeepMutable<T[P]> };
export function localizeCommand(command: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>) {
    const jsonCommand = command as DeepMutable<typeof command>;

    assert(jsonCommand.name, `Command /${command.name} must have a name using setName.`);
    const metadataKey = `commands.${jsonCommand.name}.metadata`;
    const englishData = translatorInstance.getResource('en', 'bot', metadataKey) as CommandMetadata | undefined;
    assert(englishData, `Command /${command.name} must have English localization data.`);

    // Localizing the top-level command...
    jsonCommand.description = englishData.description ?? '!MISSING DESCRIPTION!';
    /* eslint-disable camelcase */
    jsonCommand.name_localizations = {};
    /* eslint-disable camelcase */
    jsonCommand.description_localizations = {};
    for (const locale of DISCORD_LOCALES) {
        const localeData = translatorInstance.getResource(locale, 'bot', metadataKey) as CommandMetadata | undefined;
        if (locale.startsWith('en') || !localeData) {
            continue;
        }
        if (localeData.name) {
            jsonCommand.name_localizations[locale] = localeData.name;
        }
        if (localeData.description) {
            jsonCommand.description_localizations[locale] = localeData.description;
        }
    }

    // Localizing the command options...
    if (jsonCommand.options.length > 0) {
        assert(englishData.options, `Command /${command.name} must have option localizations.`);
        for (const unwritableOption of jsonCommand.options) {
            const option = unwritableOption as never as APIApplicationCommandOption;
            assert(option.name, `Option in /${command.name} must have a name using setName.`);

            const englishOptionData = englishData.options[option.name];
            option.description = englishOptionData.description ?? '!MISSING DESCRIPTION!';

            option.name_localizations = {};
            option.description_localizations = {};
            if (
                (option.type === ApplicationCommandOptionType.String ||
                    option.type === ApplicationCommandOptionType.Integer) &&
                option.choices
            ) {
                assert(
                    englishOptionData.choices,
                    `Option ${option.name} in /${command.name} must have choice localizations.`
                );
                for (const choice of option.choices) {
                    choice.name_localizations = {};
                    assert(
                        choice.value !== undefined && choice.value !== null,
                        `Choice in option ${option.name} in /${command.name} must have a value.`
                    );
                    const stringifiedValue = choice.value.toString();
                    assert(
                        englishOptionData.choices[stringifiedValue],
                        `Choice ${choice.value} of option ${option.name} in /${command.name} must have an English localization.`
                    );
                    choice.name = englishOptionData.choices[stringifiedValue];
                }
            }
            for (const locale of DISCORD_LOCALES) {
                const localeOptionData = (
                    translatorInstance.getResource(locale, 'bot', metadataKey) as CommandMetadata | undefined
                )?.options?.[option.name];

                if (locale.startsWith('en') || !localeOptionData) {
                    continue;
                }
                if (localeOptionData.name) {
                    option.name_localizations[locale] = localeOptionData.name;
                }
                if (localeOptionData.description) {
                    option.description_localizations[locale] = localeOptionData.description;
                }

                if (
                    localeOptionData.choices &&
                    (option.type === ApplicationCommandOptionType.String ||
                        option.type === ApplicationCommandOptionType.Integer) &&
                    option.choices
                ) {
                    for (const choice of option.choices) {
                        const localizedChoice = localeOptionData.choices[choice.value];
                        if (!localizedChoice) {
                            continue;
                        }
                        choice.name_localizations![locale] = localizedChoice;
                    }
                }
            }
        }
    }

    return jsonCommand as SlashCommandBuilder;
}
