export interface PoolCallbackParams {
    /**
     * Pool unique key.
     * Default value is `'default'`
     */
    key: string
    /**
     * Represents the state of whether the tasks are still running
     */
    isLoading: boolean
    /**
     * Total number of running tasks
     */
    runningTasks: number
    /**
    * The total number of queued tasks.
    * This number is reset when all tasks are finished
    */
    totalQueuedTask: number
    /**
    * Percentage of completion
    * ```    
    * var percentage = 100 * (1 - (runningTasks / totalQueuedTask)
    * ```
    */
    percentage: number
}
export type PoolSubscribeCallback = (status: PoolCallbackParams) => void;
export class Pool {
    subscribeList: PoolSubscribeCallback[] = [];
    promiseList: Promise<any>[] = [];
    taskCount: number = 0;
    poolKey: string
    /**
     * Create pool to manage manually
     * @param poolKey Unique pool key
     */
    public constructor(poolKey: string) {
        this.poolKey = poolKey;
    }

    /**
     * Subscribes to the current pool
     * @param callback Callback method
     * @returns Returns unsubscribe method
     */
    public subscribe(callback: PoolSubscribeCallback) {
        this.subscribeList.push(callback);
        return () => {
            this.subscribeList = this.subscribeList.filter(item => item !== callback);
        };
    }
    /**
     * Adds the promise current pool and notifies listeners
     * @param promise 
     */
    public append<T>(promise: Promise<T>) {
        promise.finally(this.promiseFinisher(promise))
        this.promiseList.push(promise);
        this.taskCount++;
        this.notifyStatus();
    }

    private promiseFinisher = (promise: Promise<any>) => () => {
        this.promiseList = this.promiseList.filter(item => item !== promise);
        this.notifyStatus();
    }

    private notifyStatus = () => {
        let percentage = parseInt((100 * (1 - (this.promiseList.length / this.taskCount)) || 0).toFixed());

        let paramObj: PoolCallbackParams = {
            key: this.poolKey,
            isLoading: this.promiseList.length !== 0,
            percentage,
            runningTasks: this.promiseList.length,
            totalQueuedTask: this.taskCount
        }
        this.subscribeList.forEach(func => {
            func({ ...paramObj });
        })
        if (this.promiseList.length === 0) {
            this.taskCount = 0;
        }
    }
}
