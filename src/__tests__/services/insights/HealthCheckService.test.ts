import { MockLoggerService } from '@mocks/MockLoggerService';
import { HealthCheckService } from '@services/insights/HealthCheckService';
import { IHealthCheck } from '@type/insights/IHealthCheck';
import { ILoggerService } from '@type/insights/ILoggerService';

describe('HealthCheckService', () => {
    let mockLoggerService: ILoggerService = MockLoggerService;
    let healthCheckService: HealthCheckService;

    beforeEach(() => {
        jest.clearAllMocks();
        healthCheckService = new HealthCheckService(MockLoggerService);
        mockLoggerService = MockLoggerService;
        jest.useFakeTimers();
        jest.spyOn(global, 'setInterval');
        jest.spyOn(global, 'clearInterval');
    });

    it('should set logger context on construction', () => {
        expect(mockLoggerService.setContext).toHaveBeenCalledWith({ module: 'services' });
    });

    it('should log start message and set interval on start', async () => {
        await healthCheckService.start(1000);
        expect(mockLoggerService.info).toHaveBeenCalledWith('Starting health check service...');
        expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 1000);
    });

    it('should clear existing timer on start', async () => {
        await healthCheckService.start(1000); // First start to set the timer
        await healthCheckService.start(2000); // Second start should clear the first timer and set a new one
        expect(clearInterval).toHaveBeenCalledTimes(1);
    });

    it('should log stop message and clear timer on stop', async () => {
        await healthCheckService.start(1000);
        await healthCheckService.stop();
        expect(mockLoggerService.info).toHaveBeenCalledWith('Stopping health check service...');
        expect(clearInterval).toHaveBeenCalledTimes(1);
    });

    it('should add health check on registerHealthCheck', () => {
        const mockHealthCheck: IHealthCheck = {
            name: 'MockHealthCheck',
            getStatus: jest.fn(),
            check: jest.fn()
        };

        healthCheckService.registerHealthCheck(mockHealthCheck);
        expect(healthCheckService.getHealthChecks()).toContain(mockHealthCheck);
    });
});
