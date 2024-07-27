/*
import type { IRateLimit as IRateLimitService } from '@type/security/IRateLimitService';
import type { ILoggerService } from '@type/insights/ILoggerService';

interface RequestData {
    count: number;
    lastRequestTime: number;
}

export class RateLimitService implements IRateLimitService {
    private _logger: ILoggerService;
    private _limits: Map<string, RequestData> = new Map();
    private _cooldownPeriodMs: number;
    private _cleanupIntervalMs: number;
    private _cleanupTimer: NodeJS.Timeout | undefined;

    constructor(logger: ILoggerService, cooldownPeriodMs = 60_000, cleanupIntervalMs = 3600_000) {
        this._logger = logger.setContext({ module: 'services' });
        this._cooldownPeriodMs = cooldownPeriodMs;
        this._cleanupIntervalMs = cleanupIntervalMs;
        this._startCleanup();
    }

    public checkLimit(userId: string): boolean {
        const now = Date.now();
        const requestData = this._limits.get(userId);

        if (requestData) {
            if (now - requestData.lastRequestTime < this._cooldownPeriodMs) {
                if (requestData.count >= 3) {
                    this._logger.warn(`Rate limit exceeded for user '${userId}'`);
                    return false;
                }
                requestData.count += 1;
            } else {
                requestData.count = 1;
                requestData.lastRequestTime = now;
            }
        } else {
            this._limits.set(userId, { count: 1, lastRequestTime: now });
        }

        this._logger.debug(`Request allowed for user '${userId}'`);
        return true;
    }

    private _startCleanup(): void {
        this._cleanupTimer = setInterval(() => this._cleanup(), this._cleanupIntervalMs);
        this._logger.debug(`Started rate limiter cleanup with interval ${this._cleanupIntervalMs}ms`);
    }

    private _cleanup(): void {
        const now = Date.now();
        for (const [userId, requestData] of this._limits) {
            if (now - requestData.lastRequestTime >= this._cooldownPeriodMs * 2) {
                this._limits.delete(userId);
                this._logger.debug(`Removed user '${userId}' from rate limiter`);
            }
        }
        this._logger.debug('Completed rate limiter cleanup');
    }

    public stopCleanup(): void {
        if (this._cleanupTimer) {
            clearInterval(this._cleanupTimer);
            this._cleanupTimer = undefined;
            this._logger.debug('Stopped rate limiter cleanup');
        }
    }
}
*/
