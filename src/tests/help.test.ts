import helpCommand from '../interactions/commands/info/help';
import { SlashCommandNumberOption } from 'discord.js';
import { BaseSlashCommandInteraction } from '../classes/interactions';

describe('HelpCommand', () => {
    describe('getCommandParams', () => {
        it('should return the correct command params', () => {
            const command = {
                data: {
                    options: [
                        new SlashCommandNumberOption()
                            .setName('optionname')
                            .setDescription('optionDescription')
                            .setRequired(true)
                    ]
                }
            } as unknown as BaseSlashCommandInteraction;

            const commandParams = helpCommand['getCommandParams'](command);

            expect(commandParams).toBe('**`optionname`** ');
        });

        it('should return an empty string when no options are present', () => {
            const command = {
                data: {
                    options: []
                }
            } as unknown as BaseSlashCommandInteraction;

            const commandParams = helpCommand['getCommandParams'](command);

            expect(commandParams).toBe('');
        });
    });
});
