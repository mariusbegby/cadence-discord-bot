export interface IRateLimit {
    checkLimit(userId: string): boolean;
}
