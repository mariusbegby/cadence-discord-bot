export interface IStorageClient {
    ping(): Promise<boolean>;
}
