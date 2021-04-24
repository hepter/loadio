

export interface StatusCallback {
    key: string
    isLoading: boolean
    runningTasks: number
    percentage: number
}
export type SubscribeCallback = (status: StatusCallback) => void;
export type PoolMethod<T, Z extends any[]> = (...params: Z) => Promise<T>;
export interface PoolElement {
    key: string
    pool: Pool

}

export class Pool {
    poolList: Promise<any>[] = [];
    subscribeList: SubscribeCallback[] = [];
    taskCount: number = 0;
    poolKey: string
    constructor(poolKey: string) {
        this.poolKey = poolKey;
    }
    subscribe(callback: SubscribeCallback) {
        this.subscribeList.push(callback);
        return () => {
            this.subscribeList = this.subscribeList.filter(item => item !== callback);
        };
    }

    private promiseFinisher = (promise: Promise<any>) => () => {
        this.poolList = this.poolList.filter(item => item !== promise);
        this.notifyStatus();
    }

    private notifyStatus = () => {
        this.subscribeList.forEach(func => {
            let paramObj: StatusCallback = {
                key: this.poolKey,
                isLoading: this.poolList.length !== 0,
                percentage: parseInt((100 - (100 * (this.poolList.length / this.taskCount))).toFixed()),
                runningTasks: this.poolList.length
            }
            if (this.poolList.length === 0) {
                this.taskCount = 0;
            }
            func(paramObj);
        })
    }
    public append<T>(promise: Promise<T>) {
        promise.finally(this.promiseFinisher(promise))
        this.poolList.push(promise);
        this.taskCount++;
        this.notifyStatus();
    }
}
