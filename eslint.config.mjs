import typescriptEslint from '@typescript-eslint/eslint-plugin';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    {
        ignores: ['config/**/*.js', 'locales/**/*']
    },
    ...compat.extends(
        'eslint:recommended',
        'prettier',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended'
    ),
    {
        plugins: {
            '@typescript-eslint': typescriptEslint
        },

        languageOptions: {
            globals: {
                ...globals.node
            },

            parser: tsParser,
            ecmaVersion: 'latest',
            sourceType: 'module'
        },

        rules: {
            'prettier/prettier': 'error',

            indent: [
                'error',
                4,
                {
                    SwitchCase: 1
                }
            ],

            'max-len': [
                'error',
                {
                    code: 120,
                    ignoreTemplateLiterals: true,
                    ignoreStrings: true,
                    ignoreComments: true,
                    ignoreRegExpLiterals: true,
                    ignoreUrls: true
                }
            ],

            'linebreak-style': ['error', 'windows'],

            quotes: [
                'error',
                'single',
                {
                    avoidEscape: true
                }
            ],

            semi: ['error', 'always'],
            camelcase: 'error',
            'array-bracket-spacing': ['error', 'never'],
            'object-curly-spacing': ['error', 'always'],
            'jsx-quotes': ['error', 'prefer-single'],

            'key-spacing': [
                'error',
                {
                    afterColon: true,
                    mode: 'minimum'
                }
            ],

            'no-trailing-spaces': [
                'error',
                {
                    skipBlankLines: true,
                    ignoreComments: true
                }
            ],

            curly: ['error', 'all'],
            'no-console': ['error'],

            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_'
                }
            ],

            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/ban-ts-comment': 'off'
        }
    }
];
