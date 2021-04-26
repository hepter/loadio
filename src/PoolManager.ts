import { Pool, PoolCallbackParams } from "./Pool";


type PoolManagerCallback = (poolKey: string, status: PoolCallbackParams) => void;
export type PoolManagerSubscribeCallback = (status: PoolCallbackParams) => void;
export class PoolManager {
    private static subscribeList: PoolManagerCallback[] = [];
    private static poolList: { [poolKey: string]: Pool } = {};
    private static getPoolListener(poolKey: string) {
        return (params: PoolCallbackParams) => {
            for (let index = 0; index < this.subscribeList.length; index++) {
                const listenerFunction = this.subscribeList[index];
                listenerFunction(poolKey, params)
            }
        }
    }
    /**
     * Subscribe according to the specified pool key or keys
     * @param poolKey Single or multiple unique pool key. Default value is `'default'`
     * @param callback Callback function
     * @returns Unsubscribe function
     */
    public static subscribe(callback: PoolManagerSubscribeCallback, poolKey: string | string[] = "default") {
        const callbackFunc = (key: string, status: PoolCallbackParams) => {
            if (key === poolKey || (poolKey?.length > 0 && poolKey.indexOf(key) > -1)) {
                callback(status);
            }
        }
        this.subscribeList.push(callbackFunc)
        return () => {
            this.subscribeList = this.subscribeList.filter(a => a !== callbackFunc)
        };
    }
    /**
     *  Returns the pool or create if not exist
     * @param poolKey Default value is `'default'`
     * @returns 
     */
    public static get(poolKey: string = "default") {
        let pool = this.poolList[poolKey];
        if (!pool) {
            pool = this.poolList[poolKey] = new Pool(poolKey);
            pool.subscribe(this.getPoolListener(poolKey));
        }
        return pool;
    }
    public static append<T>(promise: Promise<T>, poolKey: string = "default") {
        this.get(poolKey).append(promise);
    }
}