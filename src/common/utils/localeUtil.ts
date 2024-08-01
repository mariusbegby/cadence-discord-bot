import {
    type APIApplicationCommandOption,
    ApplicationCommandOptionType,
    type BaseInteraction,
    Locale,
    type LocaleString,
    type SlashCommandBuilder,
    type SlashCommandOptionsOnlyBuilder,
    type SlashCommandSubcommandBuilder,
    type SlashCommandSubcommandsOnlyBuilder
} from 'discord.js';
import i18n, { type TFunction } from 'i18next';
import i18nextFsBackend, { type FsBackendOptions } from 'i18next-fs-backend';
import assert from 'node:assert';
import { lstatSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

export type Translator = TFunction;

export const translatorInstance = i18n.createInstance();
const localeDir = join(__dirname, '..', '..', '..', 'locales');

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

export function useServerTranslator(interaction: BaseInteraction): Translator {
    return translatorInstance.getFixedT(interaction.guildLocale ?? 'en-US');
}

export function useUserTranslator(interaction: BaseInteraction): Translator {
    return translatorInstance.getFixedT(interaction.locale ?? 'en-US');
}

export function useLanguageTranslator(language: LocaleString): Translator {
    return translatorInstance.getFixedT(language ?? 'en-US');
}

export const DISCORD_LOCALES = Object.values(Locale);

export type SubcommandMetadata = {
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

export type CommandMetadata =
    | SubcommandMetadata
    | (SubcommandMetadata & {
          options?: Record<string, SubcommandMetadata>;
      });

type DeepMutable<T> = { -readonly [P in keyof T]: DeepMutable<T[P]> };
export function localizeCommand(
    command:
        | SlashCommandSubcommandBuilder
        | SlashCommandSubcommandsOnlyBuilder
        | SlashCommandOptionsOnlyBuilder
        | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>,
    resourcePath?: string
) {
    const jsonCommand = command as DeepMutable<typeof command>;
    const logCommandName = resourcePath ?? `/${command.name}`;

    assert(jsonCommand.name, `Command ${logCommandName} must have a name using setName.`);
    const metadataKey = resourcePath ?? `commands.${jsonCommand.name}.metadata`;
    const englishData = translatorInstance.getResource('en', 'bot', metadataKey) as CommandMetadata | undefined;
    assert(englishData, `Command ${logCommandName} must have English localization data.`);

    // Localizing the top-level command...
    assert(englishData.description, `Command ${logCommandName} is missing an English description.`);
    jsonCommand.description = englishData.description;
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
        assert(englishData.options, `Command ${logCommandName} must have option localizations.`);
        for (const unwritableOption of jsonCommand.options) {
            const option = unwritableOption as never as APIApplicationCommandOption;
            // Subcommands are stored in options - they have an 'options' field that always exists (even if empty) on subcommands
            if ('options' in option && Array.isArray(option.options)) {
                localizeCommand(
                    unwritableOption as SlashCommandSubcommandBuilder,
                    `commands.${command.name}.metadata.options.${option.name}`
                );
                continue;
            }

            assert(option.name, `Option in ${logCommandName} must have a name using setName.`);

            const englishOptionData = englishData.options[option.name];

            assert(
                englishOptionData.description,
                `Option ${option.name} in command ${logCommandName} is missing an English description.`
            );
            option.description = englishOptionData.description;

            option.name_localizations = {};
            option.description_localizations = {};
            if (
                (option.type === ApplicationCommandOptionType.String ||
                    option.type === ApplicationCommandOptionType.Integer) &&
                option.choices
            ) {
                assert(
                    englishOptionData.choices,
                    `Option ${option.name} in ${logCommandName} must have choice localizations.`
                );
                for (const choice of option.choices) {
                    choice.name_localizations = {};
                    assert(
                        choice.value !== undefined && choice.value !== null,
                        `Choice in option ${option.name} in ${logCommandName} must have a value.`
                    );
                    const stringifiedValue = choice.value.toString();
                    assert(
                        englishOptionData.choices[stringifiedValue],
                        `Choice ${choice.value} of option ${option.name} in ${logCommandName} must have an English localization.`
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
