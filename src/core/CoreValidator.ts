import type { ILoggerService } from '../services/_interfaces/insights/ILoggerService';
import type { ICoreValidator } from './_interfaces/ICoreValidator';

export class CoreValidator implements ICoreValidator {
    _logger: ILoggerService;

    constructor(logger: ILoggerService) {
        this._logger = logger;
    }

    async validateConfiguration() {
        this._logger.info('Validating configuration...');
        throw new Error('Not implemented');
    }

    async checkDependencies() {
        this._logger.info('Checking dependencies...');
        throw new Error('Not implemented');
    }
}
