import type { ILoggerService } from '@interfaces/insights/ILoggerService';

export interface ICoreValidator {
    _logger: ILoggerService;

    validateConfiguration(): void;
    checkDependencies(): void;
}
