import type { ILoggerService } from '@type/insights/ILoggerService';
import type { IConfig } from 'config';

export interface ICoreValidator {
    _logger: ILoggerService;
    _config: IConfig;

    validateEnvironmentVariables(): void;
    validateConfiguration(): void;
    checkDependencies(): void;
    checkApplicationVersion(): void;
}
