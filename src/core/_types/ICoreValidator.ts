import type { ILoggerService } from '@type/insights/ILoggerService';

export interface ICoreValidator {
    _logger: ILoggerService;

    validateConfiguration(): void;
    checkDependencies(): void;
}
