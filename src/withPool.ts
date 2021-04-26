import { PoolManager } from "./PoolManager";

/**
 * Wraps the Promise method and notifies the target pool depend by key
 * @param method The promise method desired to wrap (fetch, etc...)
 * @param poolKey Unique pool key. Default value is `'default'`
 * @returns Wrapped method
 */
export function withPool<T extends (...params: any) => Promise<any>>(method: T, poolKey: string = "default") {

    let pool = PoolManager.get(poolKey) 
    const withPoolFunction = (...params: any[]) => {
        let promise = method(...params);
        pool.append(promise);
        return promise;
    }
    return withPoolFunction as T;
}