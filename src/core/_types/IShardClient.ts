export interface IShardClient {
    start(): Promise<void>;
    registerEventListener(eventName: string, once: boolean, listener: () => void): void;
    removeAllListeners(): void;
    setMaxListeners(maxListeners: number): void;
    getShardId(guildId: string | undefined): number;
    getShardCount(): number;
    getTotalShardCount(): number;
}
