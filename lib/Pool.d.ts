export interface StatusCallback {
    key: string;
    isLoading: boolean;
    runningTasks: number;
    percentage: number;
}
export declare type SubscribeCallback = (status: StatusCallback) => void;
export declare type PoolMethod<T, Z extends any[]> = (...params: Z) => Promise<T>;
export interface PoolElement {
    key: string;
    pool: Pool;
}
export declare class Pool {
    poolList: Promise<any>[];
    subscribeList: SubscribeCallback[];
    taskCount: number;
    poolKey: string;
    constructor(poolKey: string);
    subscribe(callback: SubscribeCallback): () => void;
    private promiseFinisher;
    private notifyStatus;
    append<T>(promise: Promise<T>): void;
}
