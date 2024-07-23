import type { ILoggerService } from '../../services/_interfaces/insights/ILoggerService';

export interface ICoreValidator {
    _logger: ILoggerService;

    validateConfiguration(): void;
    checkDependencies(): void;
}
