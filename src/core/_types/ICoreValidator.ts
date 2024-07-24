import type { ILoggerService } from '@type/insights/ILoggerService';
import { IConfig } from 'config';

export interface ICoreValidator {
    _logger: ILoggerService;
    _config: IConfig;

    validateEnvironmentVariables(): void;
    validateConfiguration(): void;
    checkDependencies(): void;
}
