import type { ILoggerService } from '@services/_types/insights/ILoggerService';
import type { IShardClient } from '@core/_types/IShardClient';
import type { ComponentInteraction } from 'eris';
import type { IMessageComponent } from '@type/IMessageComponent';

export class ButtonLinkGithubComponent implements IMessageComponent {
    public customId = 'button-link-github';

    public async run(
        logger: ILoggerService,
        _shardClient: IShardClient,
        _interaction: ComponentInteraction
    ): Promise<void> {
        logger.debug(`Handling '${this.customId}' component...`);
        await _interaction.createMessage('https://github.com/mariusbegby/cadence-discord-bot');
    }
}

module.exports = new ButtonLinkGithubComponent();
