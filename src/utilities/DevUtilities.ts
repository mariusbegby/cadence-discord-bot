import type { ILoggerService } from '@type/insights/ILoggerService';

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function benchmark(logger: ILoggerService, executable: Function, times = 1): void {
    const benchmarkObserver = new PerformanceObserver((items) => {
        items.getEntries().forEach((entry) => {
            if (entry.name.includes('benchmark')) {
                logger.info(`Performance Observer: Benchmark took ${entry.duration.toFixed(2)}ms`);
            }
        });
    });
    benchmarkObserver.observe({ type: 'measure', buffered: true });

    const randomId = `benchmark-${Math.floor(Math.random() * 1000)}`;
    performance.mark(`${randomId}:start`);
    for (let i = 0; i < times; i++) {
        executable();
    }
    performance.mark(`${randomId}:end`);
    performance.measure(randomId, `${randomId}:start`, `${randomId}:end`);
}
