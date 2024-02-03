import helpCommand from '../../../interactions/slashcommands/help';
import Discord, { Client, SlashCommandNumberOption, ChatInputCommandInteraction } from 'discord.js';
import { BaseSlashCommandInteraction } from '../../../common/classes/interactions';
import { ExtendedClient } from '../../../types/clientTypes';

describe('Discord bot command test', () => {
    let client: ExtendedClient;
    let mockInteraction: ChatInputCommandInteraction;

    beforeEach(() => {
        client = new Client({
            intents: [Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildVoiceStates]
        });

        client.slashCommandInteractions = new Discord.Collection<string, BaseSlashCommandInteraction>();
        client.slashCommandInteractions.set('help', helpCommand);

        mockInteraction = {
            reply: jest.fn(),
            commandName: 'help'
        } as unknown as ChatInputCommandInteraction;
    });

    it('should reply when receiving a valid help command', async () => {
        // Execute the help command with the mock interaction
        await helpCommand.execute({
            executionId: '123',
            client,
            interaction: mockInteraction as ChatInputCommandInteraction
        });

        // Check if the reply method was called
        expect(mockInteraction.reply).toHaveBeenCalledWith(expect.anything());
    });
});

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

            const locale = 'en-US';
            const commandParams = helpCommand.getCommandParams(command, locale);

            expect(commandParams).toBe('**`optionname`** ');
        });

        it('should return an empty string when no options are present', () => {
            const command = {
                data: {
                    options: []
                }
            } as unknown as BaseSlashCommandInteraction;

            const locale = 'en-US';
            const commandParams = helpCommand.getCommandParams(command, locale);

            expect(commandParams).toBe('');
        });
    });
});
