import type { ILoggerService } from '@type/insights/ILoggerService';

export function benchmark(logger: ILoggerService, identifier: string, executable: () => void, times = 1): void {
    const benchmarkObserver = new PerformanceObserver((items) => {
        for (const entry of items.getEntries()) {
            if (entry.name.includes(`benchmark-${identifier}`)) {
                logger.debug(`Performance Observer: Benchmark '${identifier}' took ${entry.duration.toFixed(2)}ms`);
            }
        }
        benchmarkObserver.disconnect();
    });
    benchmarkObserver.observe({ type: 'measure', buffered: true });

    const randomId = `benchmark-${identifier}-${Math.floor(Math.random() * 1000)}`;
    performance.mark(`${randomId}:start`);
    for (let i = 0; i < times; i++) {
        executable();
    }
    performance.mark(`${randomId}:end`);
    performance.measure(randomId, `${randomId}:start`, `${randomId}:end`);
    performance.clearMarks(randomId);
    performance.clearMeasures(randomId);
}
