import type { ICoreValidator } from '@type/ICoreValidator';
import type { ILoggerService } from '@type/insights/ILoggerService';

export class CoreValidator implements ICoreValidator {
    _logger: ILoggerService;

    constructor(logger: ILoggerService) {
        this._logger = logger;
    }

    async validateConfiguration() {
        this._logger.debug('Validating configuration...');
        throw new Error('Not implemented');

        this._logger.info('Successfully validated configuration.');
    }

    async checkDependencies() {
        this._logger.debug('Checking for required ependencies...');
        throw new Error('Not implemented');

        this._logger.info('Successfully checked required depdendencies.');
    }
}
