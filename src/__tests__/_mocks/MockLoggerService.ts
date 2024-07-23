import { ILoggerService } from '@services/_types/insights/ILoggerService';

export const MockLoggerService: ILoggerService = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    setContext: jest.fn()
};
